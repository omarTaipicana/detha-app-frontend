import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";

const Capacitaciones = ({servidor}) => {
  const [capacitacionEdit, setCapacitacionEdit] = useState("");
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;
  const PATH_CAPACITACIONES = "/capacitaciones";

  const [
    capacitacion,
    getCapacitacion,
    postCapacitacion,
    deleteCapacitacion,
    updateCapacitacion,
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
    reset({
      capacitacion: "",
      lugar: "",
      fechaInicio: "",
      fechaFin: "",
    });
  };

  const handleEditCapacitacion = (capacitacion) => {
    setCapacitacionEdit(capacitacion);
  };

  useEffect(() => {
    getCapacitacion(PATH_CAPACITACIONES);
  }, []);

  useEffect(() => {
    reset(capacitacionEdit);
  }, [capacitacionEdit]);

  return (
    <div>
      <article>
        <span>CAPACITACIONES</span>
        <form onSubmit={handleSubmit(submit)}>
          <label className="label__form">
            <span>Nombre de la capacitación: </span>
            <input type="text" required {...register("capacitacion")} />
          </label>

          <label className="label__form">
            <span>Lugar de la Capacitación</span>
            <input type="text" required {...register("lugar")} />
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
          <button>{capacitacionEdit ? "Actualizar" : "Guardar"}</button>
        </form>
        <section>
          <table>
            <thead>
              <tr>
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
                .filter((capacitacion) => capacitacion.servidorPolicialId === servidor.id)
                .map((capacitacion) => (
                  <tr key={capacitacion.id}>
                    <td>{capacitacion.capacitacion}</td>
                    <td>{capacitacion.lugar}</td>
                    <td>{capacitacion.fechaInicio}</td>
                    <td>{capacitacion.fechaFin}</td>
                    <td style={{ border: "none" }}>
                      <img
                        src="../../../edit.png"
                        className="btn__expand"
                        onClick={() => handleEditCapacitacion(capacitacion)}
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

export default Capacitaciones;
