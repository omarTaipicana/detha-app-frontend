import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/states/alert.slice";
import Alert from "../shared/Alert";
import IsLoading from "../shared/IsLoading";
import useAuth from "../../hooks/useAuth";

const Funcion = ({ servidor, desplazamientos }) => {
  const [, , , , , , , , , , , getUserLogged, user] = useAuth();
  const dispatch = useDispatch();
  const [hide, setHide] = useState(true);
  const [hideDelete, setHideDelete] = useState(true);
  const [idDelete, setIdDelete] = useState("");
  const [funcionEdit, setFuncionEdit] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const diasEdicion = import.meta.env.VITE_DIAS_EDICION;
  const userCI = user?.cI;
  const userLoggued = user;
  const PATH_FUNCION = "/funcion";
  const PATH_VARIABLES = "/variables";

  const [
    funcion,
    getFuncion,
    postFuncion,
    deleteFuncion,
    updateFuncion,
    error,
    isLoading,
    newReg,
    deleteReg,
    updateReg,
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
    getUserLogged();
    getFuncion(PATH_FUNCION);
    getVariables(PATH_VARIABLES);
  }, []);

  useEffect(() => {
    reset(funcionEdit);
  }, [funcionEdit]);

  useEffect(() => {
    if (error) {
      dispatch(
        showAlert({
          message:
            ` ⚠️ ${error.response?.data?.message} ` || "Error inesperado",
          alertType: 1,
        })
      );
    }
  }, [error]);

  useEffect(() => {
    if (newReg) {
      dispatch(
        showAlert({
          message: ` ⚠️ Se creo un nuevo Registro ${newReg.funcion}`,
          alertType: 2,
        })
      );
    }
  }, [newReg]);

  useEffect(() => {
    if (deleteReg) {
      dispatch(
        showAlert({
          message: `⚠️ Se Elimino el Registro ${deleteReg.funcion} `,
          alertType: 4,
        })
      );
    }
  }, [deleteReg]);

  useEffect(() => {
    if (updateReg) {
      dispatch(
        showAlert({
          message: `⚠️ Se Edito el Registro ${updateReg.funcion}`,
          alertType: 2,
        })
      );
    }
  }, [updateReg]);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const ultimoDesplazamiento = desplazamientos
    ?.slice()
    .filter(
      (desplazamiento) => desplazamiento.servidorPolicialId === servidor.id
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  const ultimoPase = servidor.pases.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )[0];

  return (
    <div>
      {isLoading && <IsLoading />}
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
          <table className="table__info">
            <thead>
              <tr>
                <th style={{ border: "none", backgroundColor: "transparent" }}>
                  {((ultimoDesplazamiento &&
                    !ultimoDesplazamiento.fechaFinalización &&
                    ultimoDesplazamiento.unidad === userLoggued?.unidad &&
                    ultimoDesplazamiento.unidadSubzona ===
                      userLoggued?.unidadSubzona) ||
                    (ultimoDesplazamiento &&
                      ultimoDesplazamiento.fechaPresentacion &&
                      ultimoDesplazamiento.fechaFinalización &&
                      ultimoDesplazamiento.unidadSubzona !==
                        userLoggued?.unidadSubzona) ||
                    (ultimoDesplazamiento &&
                      ultimoDesplazamiento.fechaPresentacion &&
                      ultimoDesplazamiento.fechaFinalización &&
                      ultimoDesplazamiento.unidadSubzona ===
                        userLoggued?.unidadSubzona &&
                      ultimoPase.unidadSubzona === userLoggued?.unidadSubzona) ||
                    !ultimoDesplazamiento ||
                    userLoggued?.tipoDesignacion === "NOPERA" ||
                    userCI === superAdmin ||
                    ultimoDesplazamiento.direccion === "OTROS") && (
                    <img
                      src="../../../new.png"
                      className="btn__table"
                      onClick={() => setHide(false)}
                    />
                  )}
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
                    <td
                      style={{ border: "none", backgroundColor: "transparent" }}
                    >
                      {((ultimoDesplazamiento &&
                        !ultimoDesplazamiento.fechaFinalización &&
                        ultimoDesplazamiento.unidad === userLoggued?.unidad &&
                        ultimoDesplazamiento.unidadSubzona ===
                          userLoggued?.unidadSubzona) ||
                        (ultimoDesplazamiento &&
                          ultimoDesplazamiento.fechaPresentacion &&
                          ultimoDesplazamiento.fechaFinalización &&
                          ultimoDesplazamiento.unidadSubzona !==
                            userLoggued?.unidadSubzona) ||
                        (ultimoDesplazamiento &&
                          ultimoDesplazamiento.fechaPresentacion &&
                          ultimoDesplazamiento.fechaFinalización &&
                          ultimoDesplazamiento.unidadSubzona ===
                            userLoggued?.unidadSubzona &&
                          ultimoPase.unidadSubzona ===
                            userLoggued?.unidadSubzona) ||
                        !ultimoDesplazamiento ||
                        userLoggued?.tipoDesignacion === "NOPERA" ||
                        userCI === superAdmin ||
                        ultimoDesplazamiento.direccion === "OTROS") && (
                        <img
                          src="../../../edit.png"
                          className="btn__table"
                          onClick={() => handleEditFuncion(funcion)}
                        />
                      )}

                      {userLoggued?.cI === superAdmin && (
                        <img
                          src="../../../delete.png"
                          className="btn__table"
                          onClick={() => handleHideDelete(funcion)}
                        />
                      )}
                    </td>
                    <td className="table__td">{funcion.funcion}</td>
                    <td className="table__td">{funcion.fechaInicio}</td>
                    <td className="table__td">{funcion.fechaFin}</td>
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
      <Alert />
    </div>
  );
};

export default Funcion;
