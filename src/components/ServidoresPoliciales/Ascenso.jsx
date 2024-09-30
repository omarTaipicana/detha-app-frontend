import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";

const Ascenso = ({ servidor }) => {
  const [ascensoEdit, setAscensoEdit] = useState("");
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;
  const PATH_VARIABLES = "/variables";
  const PATH_ASCENSOS = "/ascensos";

  const [
    ascenso,
    getAscenso,
    postAscenso,
    deleteAscenso,
    updateAscenso,
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

  const [variables, getVariables] = useCrud();

  const submit = (data) => {
    if (ascensoEdit) {
      updateAscenso(PATH_ASCENSOS, ascensoEdit.id, {
        ...data,
        usuarioEdicion: userCI,
      });
    } else {
      postAscenso(PATH_ASCENSOS, {
        ...data,
        servidorPolicialId: servidor.id,
        usuarioRegistro: userCI,
        usuarioEdicion: userCI,
      });
    }
    setAscensoEdit("");
    reset({
      grado: "",
      fechaAscenso: "",
      numOrden: "",
      fechaOrden: "",
    });
  };

  const handleEditAscenso = (ascenso) => {
    setAscensoEdit(ascenso);
  };

  useEffect(() => {
    getVariables(PATH_VARIABLES);
    getAscenso(PATH_ASCENSOS);
  }, []);

  useEffect(() => {
    reset(ascensoEdit);
  }, [ascensoEdit]);

  return (
    <div>
      <article>
        <span>ASCENSOS</span>
        <form onSubmit={handleSubmit(submit)}>
          <label className="label__form">
            <span>Feacha de Ascenso: </span>
            <input
              required
              type="date"
              {...register("fechaAscenso", {
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

          {errors.fechaAscenso && (
            <p style={{ color: "red" }}>{errors.fechaAscenso.message}</p>
          )}

          <label className="label__form">
            <span>Grado: </span>
            <select required {...register("grado")}>
              <option value="">Seleccione el Grado</option>
              {variables
                ?.filter((e) => e.grado)
                .map((variable) => (
                  <option key={variable.id} value={variable.grado}>
                    {variable.grado}
                  </option>
                ))}
            </select>
          </label>

          <label className="label__form">
            <span>Número de orden: </span>
            <input type="text" required {...register("numOrden")} />
          </label>

          <label className="label__form">
            <span>Feacha de Órden: </span>
            <input
              required
              type="date"
              {...register("fechaOrden", {
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

          {errors.fechaOrden && (
            <p style={{ color: "red" }}>{errors.fechaOrden.message}</p>
          )}

          <button>{ascensoEdit ? "Actualizar" : "Guardar"}</button>
        </form>
        <section>
          <table>
            <thead>
              <tr>
                <th>GRADO</th>
                <th>FECHA DE ASCENSO</th>
                <th>ORDEN</th>
                <th>FECHA DE ORDEN</th>
              </tr>
            </thead>
            <tbody>
              {ascenso
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .filter((ascenso) => ascenso.servidorPolicialId === servidor.id)
                .map((ascenso) => (
                  <tr key={ascenso.id}>
                    <td>{ascenso.grado}</td>
                    <td>{ascenso.fechaAscenso}</td>
                    <td>{ascenso.numOrden}</td>
                    <td>{ascenso.fechaOrden}</td>
                    <td style={{ border: "none" }}>
                      <img
                        src="../../../edit.png"
                        className="btn__expand"
                        onClick={() => handleEditAscenso(ascenso)}
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

export default Ascenso;
