import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";

const Novedades = ({ servidor }) => {
  const [novedadEdit, setNovedadEdit] = useState("");
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;
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

  const handleEditNovedad = (novedad) => {
    setNovedadEdit(novedad);
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
        <span>NOVEDADES</span>
        <form onSubmit={handleSubmit(submit)}>
          <label className="label__form">
            <span>Novedad: </span>
            <select required {...register("novedad")}>
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
            <span>Tipo de Documento: </span>
            <select required {...register("tipoDocumento")}>
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
            <span>Número de Documento</span>
            <input type="text" required {...register("numDocumento")} />
          </label>
          <label className="label__form">
            <span>Fecha de Documento: </span>
            <input
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
            <span>Quién suscribe el documento</span>
            <input type="text" required {...register("suscribe")} />
          </label>
          <label className="label__form">
            <span>Fecha de Inicio: </span>
            <input
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
            <span>Fecha de Finalización: </span>
            <input
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
          <button>{novedadEdit ? "Actualizar" : "Guardar"}</button>
        </form>
        <section>
          <table>
            <thead>
              <tr>
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
                    <td>{novedad.novedad}</td>
                    <td>{novedad.tipoDocumento}</td>
                    <td>{novedad.numDocumento}</td>
                    <td>{novedad.fechaDocumento}</td>
                    <td>{novedad.suscribe}</td>
                    <td>{novedad.fechaInicio}</td>
                    <td>{novedad.fechaFin}</td>
                    <td style={{ border: "none" }}>
                      <img
                        src="../../../edit.png"
                        className="btn__expand"
                        onClick={() => handleEditNovedad(novedad)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </article>
    </div>
  );
};

export default Novedades;
