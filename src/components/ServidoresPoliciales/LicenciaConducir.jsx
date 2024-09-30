import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";

const LicenciaConducir = ({ servidor }) => {
  const [licenciaEdit, setLicenciaEdit] = useState("");
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;
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
    reset({
      tipoLicencia: "",
      fechaInicio: "",
      fechaFin: "",
    });
  };

  const handleEditLicencia = (licencia) => {
    setLicenciaEdit(licencia);
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
        <span>LICENCIA DE CONDUCIR</span>
        <form onSubmit={handleSubmit(submit)}>
          <label className="label__form">
            <span>Tipo de licencia: </span>
            <select required {...register("tipoLicencia")}>
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
            <span>Válido desde: </span>
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
            <span>Válido hasta: </span>
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

          <button>{licenciaEdit ? "Actualizar" : "Guardar"}</button>
        </form>
        <section>
          <table>
            <thead>
              <tr>
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
                    <td>{licencia.tipoLicencia}</td>
                    <td>{licencia.fechaInicio}</td>
                    <td>{licencia.fechaFin}</td>
                    <td style={{ border: "none" }}>
                      <img
                        src="../../../edit.png"
                        className="btn__expand"
                        onClick={() => handleEditLicencia(licencia)}
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

export default LicenciaConducir;
