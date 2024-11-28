import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/states/alert.slice";
import Alert from "../shared/Alert";
import IsLoading from "../shared/IsLoading";
import useAuth from "../../hooks/useAuth";

const Novedades = ({ servidor, desplazamientos }) => {
  const [, , , , , , , , , , , getUserLogged, user] = useAuth();
  const dispatch = useDispatch();
  const [hide, setHide] = useState(true);
  const [hideDelete, setHideDelete] = useState(true);
  const [idDelete, setIdDelete] = useState("");
  const [novedadEdit, setNovedadEdit] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const diasEdicion = import.meta.env.VITE_DIAS_EDICION;
  const userCI = user?.cI;
  const userLoggued = user;
  const PATH_NOVEDADES = "/novedades";
  const PATH_VARIABLES = "/variables";

  const [
    novedad,
    getNovedad,
    postNovedad,
    deleteNovedad,
    updateNovedad,
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
    const ultimaNovedad = novedad
      ?.slice()
      .filter((novedad) => novedad.servidorPolicialId === servidor.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    if (!novedadEdit) {
      if (
        ultimaNovedad &&
        (!ultimaNovedad.fechaInicio || !ultimaNovedad.fechaFin)
      ) {
        dispatch(
          showAlert({
            message:
              " ⚠️ No se puede registrar una nueva Novedad, finalice primero la ultima novedad",
            alertType: 1,
          })
        );
        return;
      }
      postNovedad(PATH_NOVEDADES, {
        ...data,
        servidorPolicialId: servidor.id,
        usuarioRegistro: userCI,
        usuarioEdicion: userCI,
      });
    } else {
      updateNovedad(PATH_NOVEDADES, novedadEdit.id, {
        ...data,
        usuarioEdicion: userCI,
      });
    }
    setNovedadEdit("");
    setHide(true);
    setIsDisabled(false);
    setIsDisabled2(false);
    reset({
      novedad: "",
      descripcion: "",
      tipoDocumento: "",
      numDocumento: "",
      suscribe: "",
      fechaDocumento: "",
      fechaInicio: "",
      fechaFin: "",
    });
  };

  const handleHideDelete = (novedad) => {
    setHideDelete(false);
    setIdDelete(novedad);
  };

  const handleDelete = () => {
    deleteNovedad(PATH_NOVEDADES, idDelete.id);
    setHideDelete(true);
    setIdDelete("");
  };

  const handleEditNovedad = (novedad) => {
    setNovedadEdit(novedad);
    setHide(false);
    if (
      !(
        new Date() - new Date(novedad.createdAt) <
          diasEdicion * 24 * 60 * 60 * 1000 || userCI === superAdmin
      )
    ) {
      setIsDisabled(true);
    }

    if (
      !(
        new Date() - new Date(novedad.updatedAt) <
          diasEdicion * 24 * 60 * 60 * 1000 ||
        !novedad.fechaFin ||
        userCI === superAdmin
      )
    ) {
      setIsDisabled2(true);
    }
  };

  useEffect(() => {
    getUserLogged();
    getNovedad(PATH_NOVEDADES);
    getVariables(PATH_VARIABLES);
  }, []);

  useEffect(() => {
    reset(novedadEdit);
  }, [novedadEdit]);

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
          message: ` ⚠️ Se creo un nuevo Registro ${newReg.novedad}`,
          alertType: 2,
        })
      );
    }
  }, [newReg]);

  useEffect(() => {
    if (deleteReg) {
      dispatch(
        showAlert({
          message: `⚠️ Se Elimino el Registro ${deleteReg.novedad} `,
          alertType: 4,
        })
      );
    }
  }, [deleteReg]);

  useEffect(() => {
    if (updateReg) {
      dispatch(
        showAlert({
          message: `⚠️ Se Edito el Registro ${updateReg.novedad}`,
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
                setNovedadEdit("");
                setHide(true);
                reset({
                  novedad: "",
                  descripcion: "",
                  tipoDocumento: "",
                  numDocumento: "",
                  suscribe: "",
                  fechaDocumento: "",
                  fechaInicio: "",
                  fechaFin: "",
                });
              }}
              className="btn__exit__form__info"
            >
              ❌
            </div>
            <label className="label__form">
              <span className="span__form__info">Novedad: </span>
              <select
                disabled={isDisabled}
                className="select__form__info"
                required
                {...register("novedad")}
              >
                <option value="">Seleccione la Novedad</option>
                {variables
                  ?.filter((e) => e.novedad)
                  .map((variable) => (
                    <option key={variable.id} value={variable.novedad}>
                      {variable.novedad}
                    </option>
                  ))}
              </select>
            </label>

            <label className="label__form">
              <span className="span__form__info">Descrición: </span>
              <input
                disabled={isDisabled}
                className="input__form__info"
                type="text"
                required
                {...register("descripcion")}
              />
            </label>

            <label className="label__form">
              <span className="span__form__info">Tipo de Documento: </span>
              <select
                disabled={isDisabled}
                className="select__form__info"
                required
                {...register("tipoDocumento")}
              >
                <option value="">Seleccione el Tipo</option>
                {variables
                  ?.filter((e) => e.tipoDeDocumento)
                  .map((variable) => (
                    <option key={variable.id} value={variable.tipoDeDocumento}>
                      {variable.tipoDeDocumento}
                    </option>
                  ))}
              </select>
            </label>
            <label className="label__form">
              <span className="span__form__info">Número de Documento</span>
              <input
                disabled={isDisabled}
                className="input__form__info"
                type="text"
                required
                {...register("numDocumento")}
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">Fecha de Documento: </span>
              <input
                disabled={isDisabled}
                className="input__form__info"
                required
                type="date"
                {...register("fechaDocumento", {
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
            {errors.fechaDocumento && (
              <p style={{ color: "red" }}>{errors.fechaDocumento.message}</p>
            )}
            {watch("novedad") === "DESCANSO MÉDICO" && (
              <label className="label__form">
                <span className="span__form__info">
                  Médico que emite Certificado:
                </span>
                <input
                  disabled={isDisabled}
                  className="input__form__info"
                  type="text"
                  required
                  {...register("suscribe")}
                />
              </label>
            )}
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
            <button>{novedadEdit ? "Actualizar" : "Guardar"}</button>
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
                      ultimoPase.unidadSubzona ===
                        userLoggued?.unidadSubzona) ||
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
                <th>NOVEDAD</th>
                <th>DESCRIPCIÓN</th>
                <th>TIPO DE DOCUMENTO</th>
                <th>NUMERO DE DOCUMENTO</th>
                <th>FECHA DOCUMENTO</th>
                <th>MEDICO QUE SUSCRIBE</th>
                <th>FECHA INICIO</th>
                <th>FECHA FINALIZACIÓN</th>
              </tr>
            </thead>
            <tbody>
              {novedad
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .filter((novedad) => novedad.servidorPolicialId === servidor.id)
                .map((novedad) => (
                  <tr key={novedad.id}>
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
                          onClick={() => handleEditNovedad(novedad)}
                        />
                      )}

                      {userLoggued?.cI === superAdmin && (
                        <img
                          src="../../../delete.png"
                          className="btn__table"
                          onClick={() => handleHideDelete(novedad)}
                        />
                      )}
                    </td>
                    <td className="table__td">{novedad.novedad}</td>
                    <td className="table__td">{novedad.descripcion}</td>
                    <td className="table__td">{novedad.tipoDocumento}</td>
                    <td className="table__td">{novedad.numDocumento}</td>
                    <td className="table__td">{novedad.fechaDocumento}</td>
                    <td className="table__td">{novedad.suscribe}</td>
                    <td className="table__td">{novedad.fechaInicio}</td>
                    <td className="table__td">{novedad.fechaFin}</td>
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

export default Novedades;
