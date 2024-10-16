import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";

const Ascenso = ({ servidor }) => {
  const [hide, setHide] = useState(true);
  const [hideDelete, setHideDelete] = useState(true);
  const [idDelete, setIdDelete] = useState("");
  const [ascensoEdit, setAscensoEdit] = useState("");
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const diasEdicion = import.meta.env.VITE_DIAS_EDICION;
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;
  const userLoggued = JSON.parse(localStorage.user ? localStorage.user : 0);
  const PATH_VARIABLES = "/variables";
  const PATH_ASCENSOS = "/ascensos";

  const [
    ascenso,
    getAscenso,
    postAscenso,
    deleteAscenso,
    updateAscenso,
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

  const [variables, getVariables] = useCrud();

  const submit = (data) => {
    if (ascensoEdit) {
      updateAscenso(PATH_ASCENSOS, ascensoEdit.id, {
        ...data,
        usuarioEdicion: userCI,
      });
    } else {
      postAscenso(PATH_ASCENSOS, {
        ...data,
        servidorPolicialId: servidor.id,
        usuarioRegistro: userCI,
        usuarioEdicion: userCI,
      });
    }
    setAscensoEdit("");
    setHide(true);
    reset({
      grado: "",
      fechaAscenso: "",
      numOrden: "",
      fechaOrden: "",
    });
  };

  const handleHideDelete = (ascenso) => {
    setHideDelete(false);
    setIdDelete(ascenso);
  };

  const handleDelete = () => {
    deleteAscenso(PATH_ASCENSOS, idDelete.id);
    setHideDelete(true);
    alert(`Se elimino el registro"  ${idDelete.grado}`);
    setIdDelete("");
  };

  const handleEditAscenso = (ascenso) => {
    setAscensoEdit(ascenso);
    setHide(false);
  };

  useEffect(() => {
    getVariables(PATH_VARIABLES);
    getAscenso(PATH_ASCENSOS);
  }, []);

  useEffect(() => {
    reset(ascensoEdit);
  }, [ascensoEdit]);

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
                setAscensoEdit("");
                setHide(true);
                reset({
                  grado: "",
                  fechaAscenso: "",
                  numOrden: "",
                  fechaOrden: "",
                });
              }}
              className="btn__exit__form__info"
            >
              ❌
            </div>
            <label className="label__form">
              <span className="span__form__info">Feacha de Ascenso: </span>
              <input
                className="input__form__info"
                required
                type="date"
                {...register("fechaAscenso", {
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

            {errors.fechaAscenso && (
              <p style={{ color: "red" }}>{errors.fechaAscenso.message}</p>
            )}

            <label className="label__form">
              <span className="span__form__info">Grado: </span>
              <select
                className="select__form__info"
                required
                {...register("grado")}
              >
                <option value="">Seleccione el Grado</option>
                {variables
                  ?.filter((e) => e.grado)
                  .map((variable) => (
                    <option key={variable.id} value={variable.grado}>
                      {variable.grado}
                    </option>
                  ))}
              </select>
            </label>

            <label className="label__form">
              <span className="span__form__info">Número de orden: </span>
              <input
                className="input__form__info"
                type="text"
                required
                {...register("numOrden")}
              />
            </label>

            <label className="label__form">
              <span className="span__form__info">Feacha de Órden: </span>
              <input
                className="input__form__info"
                required
                type="date"
                {...register("fechaOrden", {
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

            {errors.fechaOrden && (
              <p style={{ color: "red" }}>{errors.fechaOrden.message}</p>
            )}

            <button>{ascensoEdit ? "Actualizar" : "Guardar"}</button>
          </form>
        </section>
        <section>
          <table>
            <thead>
              <tr>
                <th style={{ border: "none", backgroundColor: "transparent" }}>
                  <img
                    src="../../../new.png"
                    className="btn__table"
                    onClick={() => setHide(false)}
                  />
                </th>
                <th>GRADO</th>
                <th>FECHA DE ASCENSO</th>
                <th>ORDEN</th>
                <th>FECHA DE ORDEN</th>
              </tr>
            </thead>
            <tbody>
              {ascenso
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .filter((ascenso) => ascenso.servidorPolicialId === servidor.id)
                .map((ascenso) => (
                  <tr key={ascenso.id}>
                    <td style={{ border: "none", backgroundColor: "transparent" }}>
                      {(new Date() - new Date(ascenso.createdAt) <
                        diasEdicion * 24 * 60 * 60 * 1000 ||
                        userCI === superAdmin) && (
                        <img
                          src="../../../edit.png"
                          className="btn__table"
                          onClick={() => handleEditAscenso(ascenso)}
                        />
                      )}
                      {userLoggued.cI === superAdmin && (
                        <img
                          src="../../../delete.png"
                          className="btn__table"
                          onClick={() => handleHideDelete(ascenso)}
                        />
                      )}
                    </td>
                    <td className="table__td">{ascenso.grado}</td>
                    <td className="table__td">{ascenso.fechaAscenso}</td>
                    <td className="table__td">{ascenso.numOrden}</td>
                    <td className="table__td">{ascenso.fechaOrden}</td>
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

export default Ascenso;
