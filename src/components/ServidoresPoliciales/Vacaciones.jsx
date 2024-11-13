import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/states/alert.slice";
import Alert from "../shared/Alert";
import IsLoading from "../shared/IsLoading";

const Vacaciones = ({ servidor, desplazamientos }) => {
  const dispatch = useDispatch();
  const [hide, setHide] = useState(true);
  const [hideDelete, setHideDelete] = useState(true);
  const [idDelete, setIdDelete] = useState("");
  const [vacacionesEdit, setVacacionesEdit] = useState("");
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const diasEdicion = import.meta.env.VITE_DIAS_EDICION;
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;
  const userLoggued = JSON.parse(localStorage.user ? localStorage.user : 0);
  const PATH_VACACIONES = "/vacaciones";
  const PATH_VARIABLES = "/variables";

  const [
    vacaciones,
    getVacaciones,
    postVacaciones,
    deleteVacaciones,
    updateVacaciones,
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
    if (vacacionesEdit) {
      updateVacaciones(PATH_VACACIONES, vacacionesEdit.id, {
        ...data,
        usuarioEdicion: userCI,
      });
    } else {
      postVacaciones(PATH_VACACIONES, {
        ...data,
        servidorPolicialId: servidor.id,
        usuarioRegistro: userCI,
        usuarioEdicion: userCI,
      });
    }
    setVacacionesEdit("");
    setHide(true);
    reset({
      vacaciones: "",
      fechaInicio: "",
      fechaFin: "",
    });
  };

  const handleHideDelete = (vacaciones) => {
    setHideDelete(false);
    setIdDelete(vacaciones);
  };

  const handleDelete = () => {
    deleteVacaciones(PATH_VACACIONES, idDelete.id);
    setHideDelete(true);
    setIdDelete("");
  };

  const handleEditVacaciones = (vacaciones) => {
    setVacacionesEdit(vacaciones);
    setHide(false);
  };

  useEffect(() => {
    getVacaciones(PATH_VACACIONES);
    getVariables(PATH_VARIABLES);
  }, []);

  useEffect(() => {
    reset(vacacionesEdit);
  }, [vacacionesEdit]);

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
          message: ` ⚠️ Se creo un nuevo Registro ${newReg.vacaciones}`,
          alertType: 2,
        })
      );
    }
  }, [newReg]);

  useEffect(() => {
    if (deleteReg) {
      dispatch(
        showAlert({
          message: `⚠️ Se Elimino el Registro ${deleteReg.vacaciones} `,
          alertType: 4,
        })
      );
    }
  }, [deleteReg]);

  useEffect(() => {
    if (updateReg) {
      dispatch(
        showAlert({
          message: `⚠️ Se Edito el Registro ${updateReg.vacaciones}`,
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
      <section>
        <section
          className={`form__container__info ${
            hide && "form__container__info__close"
          }`}
        >
          <form className="form__info" onSubmit={handleSubmit(submit)}>
            <div
              onClick={() => {
                setVacacionesEdit("");
                setHide(true);
                reset({
                  vacaciones: "",
                  fechaInicio: "",
                  fechaFin: "",
                });
              }}
              className="btn__exit__form__info"
            >
              ❌
            </div>
            <label className="label__form">
              <span className="span__form__info">Vacaciones: </span>
              <select
                className="select__form__info"
                required
                {...register("vacaciones")}
              >
                <option value="">Seleccione el Tipo</option>
                {variables
                  ?.filter((e) => e.vacaciones)
                  .map((variable) => (
                    <option key={variable.id} value={variable.vacaciones}>
                      {variable.vacaciones}
                    </option>
                  ))}
              </select>
            </label>
            <label className="label__form">
              <span className="span__form__info">Fecha de Inicio: </span>
              <input
                className="input__form__info"
                required
                type="date"
                {...register("fechaInicio", {
                  setValueAs: (value) => (value === "" ? null : value),
                  validate: (value) => {
                    if (!value) return true;
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate > today) {
                      return "La fecha de presentación no puede ser superior a hoy";
                    }
                    return true;
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
                className="input__form__info"
                required
                type="date"
                {...register("fechaFin", {
                  validate: (value) => {
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
            <button>{vacacionesEdit ? "Actualizar" : "Guardar"}</button>
          </form>
        </section>
        <section>
          <table className="table__info">
            <thead>
              <tr>
                <th style={{ border: "none", backgroundColor: "transparent" }}>
                  {((ultimoDesplazamiento &&
                    !ultimoDesplazamiento.fechaFinalización &&
                    ultimoDesplazamiento.unidad === userLoggued.unidad &&
                    ultimoDesplazamiento.unidadSubzona ===
                      userLoggued.unidadSubzona) ||
                    (ultimoDesplazamiento &&
                      ultimoDesplazamiento.fechaPresentacion &&
                      ultimoDesplazamiento.fechaFinalización &&
                      ultimoDesplazamiento.unidadSubzona !==
                        userLoggued.unidadSubzona) ||
                    (ultimoDesplazamiento &&
                      ultimoDesplazamiento.fechaPresentacion &&
                      ultimoDesplazamiento.fechaFinalización &&
                      ultimoDesplazamiento.unidadSubzona ===
                        userLoggued.unidadSubzona &&
                      ultimoPase.unidadSubzona === userLoggued.unidadSubzona) ||
                    !ultimoDesplazamiento ||
                    userLoggued.tipoDesignacion === "NOPERA" ||
                    userCI === superAdmin ||
                    ultimoDesplazamiento.direccion === "OTROS") && (
                    <img
                      src="../../../new.png"
                      className="btn__table"
                      onClick={() => setHide(false)}
                    />
                  )}
                </th>
                <th>VACACIONES</th>
                <th>FECHA INICIO</th>
                <th>FECHA FINALIZACIÓN</th>
              </tr>
            </thead>
            <tbody>
              {vacaciones
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .filter(
                  (vacaciones) => vacaciones.servidorPolicialId === servidor.id
                )
                .map((vacaciones) => (
                  <tr key={vacaciones.id}>
                    <td style={{ border: "none" }}>
                      {((new Date() - new Date(vacaciones.createdAt) <
                        diasEdicion * 24 * 60 * 60 * 1000 &&
                        ((ultimoDesplazamiento &&
                          !ultimoDesplazamiento.fechaFinalización &&
                          ultimoDesplazamiento.unidad === userLoggued.unidad &&
                          ultimoDesplazamiento.unidadSubzona ===
                            userLoggued.unidadSubzona) ||
                          (ultimoDesplazamiento &&
                            ultimoDesplazamiento.fechaPresentacion &&
                            ultimoDesplazamiento.fechaFinalización &&
                            ultimoDesplazamiento.unidadSubzona !==
                              userLoggued.unidadSubzona) ||
                          (ultimoDesplazamiento &&
                            ultimoDesplazamiento.fechaPresentacion &&
                            ultimoDesplazamiento.fechaFinalización &&
                            ultimoDesplazamiento.unidadSubzona ===
                              userLoggued.unidadSubzona &&
                            ultimoPase.unidadSubzona ===
                              userLoggued.unidadSubzona) ||
                          !ultimoDesplazamiento ||
                          userLoggued.tipoDesignacion === "NOPERA")) ||
                        userCI === superAdmin ||
                        ultimoDesplazamiento.direccion === "OTROS") && (
                        <img
                          src="../../../edit.png"
                          className="btn__table"
                          onClick={() => handleEditVacaciones(vacaciones)}
                        />
                      )}
                      {userLoggued.cI === superAdmin && (
                        <img
                          src="../../../delete.png"
                          className="btn__table"
                          onClick={() => handleHideDelete(vacaciones)}
                        />
                      )}
                    </td>
                    <td className="table__td">{vacaciones.vacaciones}</td>
                    <td className="table__td">{vacaciones.fechaInicio}</td>
                    <td className="table__td">{vacaciones.fechaFin}</td>
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
      </section>
      <Alert />
    </div>
  );
};

export default Vacaciones;
