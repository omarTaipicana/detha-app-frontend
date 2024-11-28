import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/states/alert.slice";
import Alert from "../shared/Alert";
import IsLoading from "../shared/IsLoading";
import useAuth from "../../hooks/useAuth";

const Capacitaciones = ({ servidor, desplazamientos }) => {
  const [, , , , , , , , , , , getUserLogged, user] = useAuth();
  const dispatch = useDispatch();
  const [hide, setHide] = useState(true);
  const [hideDelete, setHideDelete] = useState(true);
  const [idDelete, setIdDelete] = useState("");
  const [capacitacionEdit, setCapacitacionEdit] = useState("");
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const diasEdicion = import.meta.env.VITE_DIAS_EDICION;
  const userCI = user?.cI;
  const userLoggued = user;
  const PATH_CAPACITACIONES = "/capacitaciones";

  const [
    capacitacion,
    getCapacitacion,
    postCapacitacion,
    deleteCapacitacion,
    updateCapacitacion,
    error,
    isLoading,
    newReg,
    deleteReg,
    updateReg,
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

  const submit = (data) => {
    if (capacitacionEdit) {
      updateCapacitacion(PATH_CAPACITACIONES, capacitacionEdit.id, {
        ...data,
        usuarioEdicion: userCI,
      });
    } else {
      postCapacitacion(PATH_CAPACITACIONES, {
        ...data,
        servidorPolicialId: servidor.id,
        usuarioRegistro: userCI,
        usuarioEdicion: userCI,
      });
    }
    setCapacitacionEdit("");
    setHide(true);
    reset({
      capacitacion: "",
      lugar: "",
      fechaInicio: "",
      fechaFin: "",
    });
  };

  const handleHideDelete = (capacitacion) => {
    setHideDelete(false);
    setIdDelete(capacitacion);
  };

  const handleDelete = () => {
    deleteCapacitacion(PATH_CAPACITACIONES, idDelete.id);
    setHideDelete(true);
    setIdDelete("");
  };

  const handleEditCapacitacion = (capacitacion) => {
    setCapacitacionEdit(capacitacion);
    setHide(false);
  };

  useEffect(() => {
    getUserLogged();
    getCapacitacion(PATH_CAPACITACIONES);
  }, []);

  useEffect(() => {
    reset(capacitacionEdit);
  }, [capacitacionEdit]);

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
          message: ` ⚠️ Se creo un nuevo Registro ${newReg.capacitacion}`,
          alertType: 2,
        })
      );
    }
  }, [newReg]);

  useEffect(() => {
    if (deleteReg) {
      dispatch(
        showAlert({
          message: `⚠️ Se Elimino el Registro ${deleteReg.capacitacion} `,
          alertType: 4,
        })
      );
    }
  }, [deleteReg]);

  useEffect(() => {
    if (updateReg) {
      dispatch(
        showAlert({
          message: `⚠️ Se Edito el Registro ${updateReg.capacitacion}`,
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
                setCapacitacionEdit("");
                setHide(true);
                reset({
                  capacitacion: "",
                  lugar: "",
                  fechaInicio: "",
                  fechaFin: "",
                });
              }}
              className="btn__exit__form__info"
            >
              ❌
            </div>
            <label className="label__form">
              <span className="span__form__info">
                Nombre de la capacitación:{" "}
              </span>
              <input
                className="input__form__info"
                type="text"
                required
                {...register("capacitacion")}
              />
            </label>

            <label className="label__form">
              <span className="span__form__info">Lugar de la Capacitación</span>
              <input
                className="input__form__info"
                type="text"
                required
                {...register("lugar")}
              />
            </label>

            <label className="label__form">
              <span className="span__form__info">Fecha de Inicio: </span>
              <input
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
                className="input__form__info"
                required
                type="date"
                {...register("fechaFin", {
                  required: "La fecha es obligatoria",
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
            <button>{capacitacionEdit ? "Actualizar" : "Guardar"}</button>
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
                    ultimoDesplazamiento?.direccion === "OTROS") && (
                    <img
                      src="../../../new.png"
                      className="btn__table"
                      onClick={() => setHide(false)}
                    />
                  )}
                </th>
                <th>CAPACITACION</th>
                <th>LUGAR</th>
                <th>FECHA INICIO</th>
                <th>FECHA FINALIZACIÓN</th>
              </tr>
            </thead>
            <tbody>
              {capacitacion
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .filter(
                  (capacitacion) =>
                    capacitacion.servidorPolicialId === servidor.id
                )
                .map((capacitacion) => (
                  <tr key={capacitacion.id}>
                    <td
                      style={{ border: "none", backgroundColor: "transparent" }}
                    >
                      {((new Date() - new Date(capacitacion.createdAt) <
                        diasEdicion * 24 * 60 * 60 * 1000 &&
                        ((ultimoDesplazamiento &&
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
                          userLoggued?.tipoDesignacion === "NOPERA")) ||
                        userCI === superAdmin ||
                        ultimoDesplazamiento?.direccion === "OTROS") && (
                        <img
                          src="../../../edit.png"
                          className="btn__table"
                          onClick={() => handleEditCapacitacion(capacitacion)}
                        />
                      )}
                      {userLoggued?.cI === superAdmin && (
                        <img
                          src="../../../delete.png"
                          className="btn__table"
                          onClick={() => handleHideDelete(capacitacion)}
                        />
                      )}
                    </td>
                    <td className="table__td">{capacitacion.capacitacion}</td>
                    <td className="table__td">{capacitacion.lugar}</td>
                    <td className="table__td">{capacitacion.fechaInicio}</td>
                    <td className="table__td">{capacitacion.fechaFin}</td>
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

export default Capacitaciones;
