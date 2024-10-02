import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";

const LicenciaConducir = ({ servidor }) => {
  const [hide, setHide] = useState(true);
  const [hideDelete, setHideDelete] = useState(true);
  const [idDelete, setIdDelete] = useState("");
  const [licenciaEdit, setLicenciaEdit] = useState("");
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const diasEdicion = import.meta.env.VITE_DIAS_EDICION;
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;
  const userLoggued = JSON.parse(localStorage.user ? localStorage.user : 0);
  const PATH_LICENCIAS = "/licencias";
  const PATH_VARIABLES = "/variables";

  const [
    licencia,
    getLicencia,
    postLicencia,
    deleteLicencia,
    updateLicencia,
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
    if (licenciaEdit) {
      updateLicencia(PATH_LICENCIAS, licenciaEdit.id, {
        ...data,
        usuarioEdicion: userCI,
      });
    } else {
      postLicencia(PATH_LICENCIAS, {
        ...data,
        servidorPolicialId: servidor.id,
        usuarioRegistro: userCI,
        usuarioEdicion: userCI,
      });
    }
    setLicenciaEdit("");
    setHide(true);
    reset({
      tipoLicencia: "",
      fechaInicio: "",
      fechaFin: "",
    });
  };

  const handleHideDelete = (licencia) => {
    setHideDelete(false);
    setIdDelete(licencia);
  };

  const handleDelete = () => {
    deleteLicencia(PATH_LICENCIAS, idDelete.id);
    setHideDelete(true);
    alert(`Se elimino el registro"  ${idDelete.licencia}`);
    setIdDelete("");
  };

  const handleEditLicencia = (licencia) => {
    setLicenciaEdit(licencia);
    setHide(false);
  };

  useEffect(() => {
    getLicencia(PATH_LICENCIAS);
    getVariables(PATH_VARIABLES);
  }, []);

  useEffect(() => {
    reset(licenciaEdit);
  }, [licenciaEdit]);

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
                setLicenciaEdit("");
                setHide(true);
                reset({
                  tipoLicencia: "",
                  fechaInicio: "",
                  fechaFin: "",
                });
              }}
              className="btn__exit__form__info"
            >
              ❌
            </div>
            <label className="label__form">
              <span className="span__form__info">Tipo de licencia: </span>
              <select
                className="select__form__info"
                required
                {...register("tipoLicencia")}
              >
                <option value="">Seleccione el Grado</option>
                {variables
                  ?.filter((e) => e.tipoLicencia)
                  .map((variable) => (
                    <option key={variable.id} value={variable.tipoLicencia}>
                      {variable.tipoLicencia}
                    </option>
                  ))}
              </select>
            </label>

            <label className="label__form">
              <span className="span__form__info">Válido desde: </span>
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
              <span className="span__form__info">Válido hasta: </span>
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

            <button>{licenciaEdit ? "Actualizar" : "Guardar"}</button>
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
                <th>TIPO</th>
                <th>FECHA DESDE</th>
                <th>FECHA HASTA</th>
              </tr>
            </thead>
            <tbody>
              {licencia
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .filter(
                  (licencia) => licencia.servidorPolicialId === servidor.id
                )
                .map((licencia) => (
                  <tr key={licencia.id}>
                    <td style={{ border: "none", backgroundColor: "white" }}>
                      {(new Date() - new Date(licencia.createdAt) <
                        diasEdicion * 24 * 60 * 60 * 1000 ||
                        userCI === superAdmin) && (
                        <img
                          src="../../../edit.png"
                          className="btn__table"
                          onClick={() => handleEditLicencia(licencia)}
                        />
                      )}
                      {userLoggued.cI === superAdmin && (
                        <img
                          src="../../../delete.png"
                          className="btn__table"
                          onClick={() => handleHideDelete(licencia)}
                        />
                      )}
                    </td>
                    <td>{licencia.tipoLicencia}</td>
                    <td>{licencia.fechaInicio}</td>
                    <td>{licencia.fechaFin}</td>
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

export default LicenciaConducir;
