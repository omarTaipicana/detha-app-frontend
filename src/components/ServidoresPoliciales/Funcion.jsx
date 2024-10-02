import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";

const Funcion = ({ servidor }) => {
  const [hide, setHide] = useState(true);
  const [hideDelete, setHideDelete] = useState(true);
  const [idDelete, setIdDelete] = useState("");
  const [funcionEdit, setFuncionEdit] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const diasEdicion = import.meta.env.VITE_DIAS_EDICION;
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;
  const userLoggued = JSON.parse(localStorage.user ? localStorage.user : 0);
  const PATH_FUNCION = "/funcion";
  const PATH_VARIABLES = "/variables";

  const [
    funcion,
    getFuncion,
    postFuncion,
    deleteFuncion,
    updateFuncion,
    hasError,
    isLoading,
  ] = useCrud();

  const [variables, getVariables] = useCrud();
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

  const submit = (data) => {
    if (funcionEdit) {
      updateFuncion(PATH_FUNCION, funcionEdit.id, {
        ...data,
        usuarioEdicion: userCI,
      });
    } else {
      postFuncion(PATH_FUNCION, {
        ...data,
        servidorPolicialId: servidor.id,
        usuarioRegistro: userCI,
        usuarioEdicion: userCI,
      });
    }
    setFuncionEdit("");
    setHide(true);
    setIsDisabled(false);
    setIsDisabled2(false);
    reset({
      funcion: "",
      fechaInicio: "",
      fechaFin: "",
    });
  };

  const handleHideDelete = (funcion) => {
    setHideDelete(false);
    setIdDelete(funcion);
  };

  const handleDelete = () => {
    deleteFuncion(PATH_FUNCION, idDelete.id);
    setHideDelete(true);
    alert(`Se elimino el registro"  ${idDelete.funcion}`);
    setIdDelete("");
  };

  const handleEditFuncion = (funcion) => {
    setFuncionEdit(funcion);
    setHide(false);
    if (
      !(
        new Date() - new Date(funcion.createdAt) <
          diasEdicion * 24 * 60 * 60 * 1000 || userCI === superAdmin
      )
    ) {
      setIsDisabled(true);
    }

    if (
      !(
        new Date() - new Date(funcion.updatedAt) <
          diasEdicion * 24 * 60 * 60 * 1000 ||
        !funcion.fechaFin ||
        userCI === superAdmin
      )
    ) {
      setIsDisabled2(true);
    }
  };

  useEffect(() => {
    getFuncion(PATH_FUNCION);
    getVariables(PATH_VARIABLES);
  }, []);

  useEffect(() => {
    reset(funcionEdit);
  }, [funcionEdit]);

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
                setFuncionEdit("");
                setHide(true);
                reset({
                  funcion: "",
                  fechaInicio: "",
                  fechaFin: "",
                });
              }}
              className="btn__exit__form__info"
            >
              ❌
            </div>
            <label className="label__form">
              <span className="span__form__info">Función Actual: </span>
              <select
                disabled={isDisabled}
                className="select__form__info"
                required
                {...register("funcion")}
              >
                <option value="">Seleccione el Tipo</option>
                {variables
                  ?.filter((e) => e.funcion)
                  .map((variable) => (
                    <option key={variable.id} value={variable.funcion}>
                      {variable.funcion}
                    </option>
                  ))}
              </select>
            </label>
            <label className="label__form">
              <span className="span__form__info">Fecha de Inicio: </span>
              <input
                disabled={isDisabled}
                className="input__form__info"
                required
                type="date"
                {...register("fechaInicio", {
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
            {errors.fechaInicio && (
              <p style={{ color: "red" }}>{errors.fechaInicio.message}</p>
            )}
            <label className="label__form">
              <span className="span__form__info">Fecha de Finalización: </span>
              <input
                disabled={isDisabled2}
                className="input__form__info"
                type="date"
                {...register("fechaFin", {
                  setValueAs: (value) => (value === "" ? null : value),
                  validate: (value) => {
                    if (!value) return true;
                    const selectedDate = new Date(value);
                    const inicio = new Date(watch("fechaInicio"));
                    selectedDate.setHours(0, 0, 0, 0);
                    inicio.setHours(0, 0, 0, 0);
                    return (
                      selectedDate >= inicio ||
                      "La fecha no puede ser inferior a la fecha de inicio"
                    );
                  },
                })}
              />
            </label>
            {errors.fechaFin && (
              <p style={{ color: "red" }}>{errors.fechaFin.message}</p>
            )}
            <button>{funcionEdit ? "Actualizar" : "Guardar"}</button>
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
                <th>FUNCIÓN ACTUAL</th>
                <th>FECHA INICIO</th>
                <th>FECHA FINALIZACIÓN</th>
              </tr>
            </thead>
            <tbody>
              {funcion
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .filter((funcion) => funcion.servidorPolicialId === servidor.id)
                .map((funcion) => (
                  <tr key={funcion.id}>
                    <td style={{ border: "none", backgroundColor: "white" }}>
                      <img
                        src="../../../edit.png"
                        className="btn__table"
                        onClick={() => handleEditFuncion(funcion)}
                      />

                      {userLoggued.cI === superAdmin && (
                        <img
                          src="../../../delete.png"
                          className="btn__table"
                          onClick={() => handleHideDelete(funcion)}
                        />
                      )}
                    </td>
                    <td>{funcion.funcion}</td>
                    <td>{funcion.fechaInicio}</td>
                    <td>{funcion.fechaFin}</td>
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

export default Funcion;
