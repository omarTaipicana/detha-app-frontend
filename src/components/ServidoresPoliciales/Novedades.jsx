import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";

const Novedades = ({ servidor }) => {
  const [hide, setHide] = useState(true);
  const [hideDelete, setHideDelete] = useState(true);
  const [idDelete, setIdDelete] = useState("");
  const [novedadEdit, setNovedadEdit] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const diasEdicion = import.meta.env.VITE_DIAS_EDICION;
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;
  const userLoggued = JSON.parse(localStorage.user ? localStorage.user : 0);
  const PATH_NOVEDADES = "/novedades";
  const PATH_VARIABLES = "/variables";

  const [
    novedad,
    getNovedad,
    postNovedad,
    deleteNovedad,
    updateNovedad,
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
    if (novedadEdit) {
      updateNovedad(PATH_NOVEDADES, novedadEdit.id, {
        ...data,
        usuarioEdicion: userCI,
      });
    } else {
      postNovedad(PATH_NOVEDADES, {
        ...data,
        servidorPolicialId: servidor.id,
        usuarioRegistro: userCI,
        usuarioEdicion: userCI,
      });
    }
    setNovedadEdit("");
    setHide(true);
    setIsDisabled(false);
    setIsDisabled2(false);
    reset({
      novedad: "",
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
    alert(`Se elimino el registro"  ${idDelete.novedad}`);
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
    getNovedad(PATH_NOVEDADES);
    getVariables(PATH_VARIABLES);
  }, []);

  useEffect(() => {
    reset(novedadEdit);
  }, [novedadEdit]);

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
                setNovedadEdit("");
                setHide(true);
                reset({
                  novedad: "",
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
            <label className="label__form">
              <span className="span__form__info">
                Quién suscribe el documento
              </span>
              <input
                disabled={isDisabled}
                className="input__form__info"
                type="text"
                required
                {...register("suscribe")}
              />
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
              <input disabled={isDisabled2}
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
                <th>NOVEDAD</th>
                <th>TIPO DE DOCUMENTO</th>
                <th>NUMERO DE DOCUMENTO</th>
                <th>FECHA DOCUMENTO</th>
                <th>QUIEN SUSCRIBE</th>
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
                    <td style={{ border: "none", backgroundColor: "transparent" }}>
                      <img
                        src="../../../edit.png"
                        className="btn__table"
                        onClick={() => handleEditNovedad(novedad)}
                      />

                      {userLoggued.cI === superAdmin && (
                        <img
                          src="../../../delete.png"
                          className="btn__table"
                          onClick={() => handleHideDelete(novedad)}
                        />
                      )}
                    </td>
                    <td className="table__td">{novedad.novedad}</td>
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
    </div>
  );
};

export default Novedades;
