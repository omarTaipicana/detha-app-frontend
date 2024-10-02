import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";

const Titulos = ({ servidor }) => {
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const diasEdicion = import.meta.env.VITE_DIAS_EDICION;
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;
  const userLoggued = JSON.parse(localStorage.user ? localStorage.user : 0);
  const [hide, setHide] = useState(true);
  const [hideDelete, setHideDelete] = useState(true);
  const [idDelete, setIdDelete] = useState("");
  const [tituloEdit, setTituloEdit] = useState("");
  const PATH_TITULOS = "/titulos";
  const [
    titulo,
    getTitulo,
    postTitulo,
    deleteTitulo,
    updateTitulo,
    hasError,
    isLoading,
  ] = useCrud();
  const {
    register,
    handleSubmit,
    reset,
    value,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getTitulo(PATH_TITULOS);
  }, []);

  const submit = (data) => {
    const body = { ...data, servidorPolicialId: servidor.id };

    if (tituloEdit) {
      updateTitulo(PATH_TITULOS, tituloEdit.id, body);
    } else {
      postTitulo(PATH_TITULOS, body);
    }

    reset({
      fecha: "",
      titulo: "",
      institucion: "",
      servidorPolicialId: "",
    });
    setTituloEdit("");
    setHide(true);
  };

  const handleHideDelete = (titulo) => {
    setHideDelete(false);
    setIdDelete(titulo);
  };

  const handleDelete = () => {
    deleteTitulo(PATH_TITULOS, idDelete.id);
    setHideDelete(true);
    alert(`Se elimino el registro"  ${idDelete.titulo}`);
    setIdDelete("");
  };

  const handleEditTitulo = (titulo) => {
    setTituloEdit(titulo);
    setHide(false);
  };

  useEffect(() => {
    reset(tituloEdit);
  }, [tituloEdit]);

  return (
    <div>
      <article>
        <section
          className={`form__container__info ${
            hide && "form__container__info__close"
          }`}
        >
          <form className="form__info" onSubmit={handleSubmit(submit)}>
            <div
              onClick={() => {
                reset({
                  fecha: "",
                  titulo: "",
                  institucion: "",
                  servidorPolicialId: "",
                });
                setTituloEdit("");
                setHide(true);
              }}
              className="btn__exit__form__info"
            >
              ❌
            </div>
            <label className="label__form">
              <span className="span__form__info">Fecha: </span>
              <input
                className="input__form__info"
                required
                type="date"
                {...register("fecha", {
                  required: "La fecha es obligatoria",
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return (
                      selectedDate <= today ||
                      "La fecha no puede ser superior a hoy"
                    );
                  },
                })}
              />
            </label>

            {errors.fecha && (
              <p style={{ color: "red" }}>{errors.fecha.message}</p>
            )}

            <label className="label__form">
              <span className="span__form__info">Título: </span>
              <input
                className="input__form__info"
                type="text"
                required
                {...register("titulo")}
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">Institución: </span>
              <input
                className="input__form__info"
                type="text"
                required
                {...register("institucion")}
              />
            </label>

            <button>{tituloEdit ? "Actualizar" : "Guardar"}</button>
          </form>
        </section>
        <section>
          <table>
            <thead>
              <tr>
                <th style={{ border: "none", backgroundColor: "white" }}>
                  <img
                    src="../../../new.png"
                    className="btn__table"
                    onClick={() => setHide(false)}
                  />
                </th>
                <th>FECHA</th>
                <th>TITULO</th>
                <th>INTITUCION</th>
              </tr>
            </thead>
            <tbody>
              {titulo
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .filter((titulo) => titulo.servidorPolicialId === servidor.id)
                .map((titulo) => (
                  <tr key={titulo.id}>
                    <td style={{ border: "none", backgroundColor: "white" }}>
                      {(new Date() - new Date(titulo.createdAt) <
                        diasEdicion * 24 * 60 * 60 * 1000 ||
                        userCI === superAdmin) && (
                        <img
                          src="../../../edit.png"
                          className="btn__table"
                          onClick={() => handleEditTitulo(titulo)}
                        />
                      )}
                      {userLoggued.cI === superAdmin && (
                        <img
                          src="../../../delete.png"
                          className="btn__table"
                          onClick={() => handleHideDelete(titulo)}
                        />
                      )}
                    </td>
                    <td>{titulo.fecha}</td>
                    <td>{titulo.institucion}</td>
                    <td>{titulo.titulo}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
        <section
          className={`form__container__info ${
            hideDelete && "form__container__info__close"
          }`}
        >
          <div className="form__info">
            <span className="delete__card">
              Esta seguro de eliminar el Registro
            </span>
            <div className="btn__delete__content">
              <button onClick={handleDelete} className="btn__form__info">
                SI
              </button>
              <button
                onClick={() => setHideDelete(true)}
                className="btn__form__info"
              >
                NO
              </button>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};

export default Titulos;
