import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";

const Titulos = ({ servidor }) => {
  const [tituloEdit, setTituloEdit] = useState("");
  const PATH_TITULOS = "/titulos";
  const [
    titulo,
    getTitulo,
    postTitulo,
    deleteTitulo,
    updateTitulo,
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

  useEffect(() => {
    getTitulo(PATH_TITULOS);
  }, []);

  const submit = (data) => {
    const body = { ...data, servidorPolicialId: servidor.id };

    if (tituloEdit) {
      updateTitulo(PATH_TITULOS, tituloEdit.id, body);
    } else {
      postTitulo(PATH_TITULOS, body);
    }

    reset({
      fecha: "",
      titulo: "",
      institucion: "",
      servidorPolicialId: "",
    });
    setTituloEdit("");
  };

  useEffect(() => {
    reset(tituloEdit);
  }, [tituloEdit]);

  const handleEditTitulo = (titulo) => {
    setTituloEdit(titulo);
  };

  return (
    <div>
      <article>
        <span>TITULOS</span>
        <form onSubmit={handleSubmit(submit)}>
          <label>
            <span>Fecha: </span>
            <input
            required
              type="date"
              {...register("fecha", {
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
          

          {errors.fecha && (
            <p style={{ color: "red" }}>{errors.fecha.message}</p>
          )}

          <label>
            <span>Título: </span>
            <input type="text" required {...register("titulo")} />
          </label>
          <label>
            <span>Institución: </span>
            <input type="text" required {...register("institucion")} />
          </label>

          <button>{tituloEdit ? "Actualizar" : "Guardar"}</button>
        </form>
        <section>
          <table>
            <thead>
              <tr>
                <th>FECHA</th>
                <th>TITULO</th>
                <th>INTITUCION</th>
              </tr>
            </thead>
            <tbody>
              {titulo
                .filter((titulo) => titulo.servidorPolicialId === servidor.id)
                .map((titulo) => (
                  <tr key={titulo.id}>
                    <td>{titulo.fecha}</td>
                    <td>{titulo.institucion}</td>
                    <td>{titulo.titulo}</td>
                    <td style={{ border: "none" }}>
                      <img
                        src="../../../edit.png"
                        className="btn__expand"
                        onClick={() => handleEditTitulo(titulo)}
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

export default Titulos;
