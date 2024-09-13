import React, { useEffect, useState } from "react";
import axios from "axios";
import getConfigToken from "../../services/getConfigToken";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";

const Pases = ({ servidor }) => {
  const urlBase = import.meta.env.VITE_API_URL;
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;

  const [paseEdit, setPaseEdit] = useState("");
  const [organicos, setOrganicos] = useState([]);
  const [selectedDireccion, setSelectedDireccion] = useState("");
  const [selectedUnidad, setSelectedUnidad] = useState("");
  const [selectedSiglas, setSelectedSiglas] = useState("");
  const [selectedCargo, setSelectedCargo] = useState("");
  const [unidadesOptions, setUnidadesOptions] = useState([]);
  const [siglasOptions, setSiglasOptions] = useState([]);
  const [cargoOptions, setCargoOptions] = useState([]);

  const PATH_PASES = "/pases";
  const [pase, getPase, postPase, deletePase, updatePase, hasError, isLoading] =
    useCrud();
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
    if (paseEdit) {
      updatePase(PATH_PASES, paseEdit.id, {
        ...data,
        servidorPolicialId: servidor.id,
        usuarioEdicion: userCI,
      });
    } else {
      postPase(PATH_PASES, {
        ...data,
        servidorPolicialId: servidor.id,
        usuarioRegistro: userCI,
        usuarioEdicion: userCI,
      });
    }
    setSelectedDireccion("");
    setSelectedUnidad("");
    setSelectedSiglas("");
    setSelectedCargo("");
    reset({
      numeroTelegrama: "",
      fechaTelegrama: "",
      direccion: "",
      unidad: "",
      nomenclatura: "",
      nomenclaturaNoDigin: "",
    });

    setPaseEdit("");
  };

  const handleEditPase = (pase) => {
    setPaseEdit(pase);
  };

  useEffect(() => {
    getPase(PATH_PASES);
    axios
      .get(`${urlBase}/organicos`, getConfigToken())
      .then((res) => setOrganicos(res.data))
      .catch((err) => console.log(err));

    reset(paseEdit);
    setUnidadesOptions(obtenerUnidadesPorDireccion(paseEdit?.direccion));
    setSiglasOptions(obtenerSiglasPorUnidad(paseEdit?.unidad));
    setCargoOptions(obtenerCargosPorSigla(paseEdit?.nomenclatura));

    setSelectedDireccion(paseEdit?.direccion);
    setSelectedUnidad(paseEdit?.unidad);
    setSelectedSiglas(paseEdit?.nomenclatura);
    setSelectedCargo(paseEdit?.cargo);
  }, [paseEdit]);

  useEffect(() => {
    if (selectedDireccion !== "OTROS") {
      setValue("nomenclaturaNoDigin", "");
    }
  }, [selectedDireccion, setValue]);

  const obtenerUnidadesPorDireccion = (siglasDireccion) => {
    return organicos.filter((item) => item.siglasDireccion === siglasDireccion);
  };
  const obtenerSiglasPorUnidad = (siglaUnidadGrupo) => {
    return organicos.filter(
      (item) => item.siglaUnidadGrupo === siglaUnidadGrupo
    );
  };
  const obtenerCargosPorSigla = (nomenclatura) => {
    return organicos.filter((item) => item.nomenclatura === nomenclatura);
  };

  const handleDireccionChange = (selected) => {
    setSelectedDireccion(selected);
    const unidadesByDireccion = obtenerUnidadesPorDireccion(selected);
    setUnidadesOptions(unidadesByDireccion);
    setSelectedUnidad("");
    setSelectedSiglas("");
    setSelectedCargo("");
    setCargoOptions([]);
    setSiglasOptions([]);
  };

  const handleUnidadChange = (selected) => {
    setSelectedUnidad(selected);
    const siglasByUnidad = obtenerSiglasPorUnidad(selected);
    setSiglasOptions(siglasByUnidad);
    setSelectedSiglas("");
    setSelectedCargo("");
    setCargoOptions([]);
  };

  const handleSiglasChange = (selected) => {
    setSelectedSiglas(selected);
    const cargoBySigla = obtenerCargosPorSigla(selected);
    setCargoOptions(cargoBySigla);
    setSelectedCargo("");
  };

  const handleCargoChange = (selected) => {
    setSelectedCargo(selected);
  };

  return (
    <div>
      <article>
        <span>PASES</span>
        <form onSubmit={handleSubmit(submit)}>
          <label>
            <span>Número de Telegrama</span>
            <input type="text" required {...register("numeroTelegrama")} />
          </label>
          <label>
            <span>Fecha Telegrama: </span>
            <input
              required
              type="date"
              {...register("fechaTelegrama", {
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
          {errors.fechaTelegrama && (
            <p style={{ color: "red" }}>{errors.fechaTelegrama.message}</p>
          )}
          <label htmlFor="">
            <span>Dirección</span>
            <select
              required
              {...register("direccion")}
              value={selectedDireccion}
              onChange={(e) => handleDireccionChange(e.target.value)}
            >
              <option value="">Seleccione la Dirección</option>
              {[...new Set(organicos.map((e) => e.siglasDireccion))].map(
                (direccion) => (
                  <option key={direccion} value={direccion}>
                    {direccion}
                  </option>
                )
              )}
            </select>
          </label>
          <label htmlFor="">
            <span>Unidad</span>
            <select
              required
              {...register("unidad")}
              value={selectedUnidad}
              onChange={(e) => handleUnidadChange(e.target.value)}
            >
              <option value="">Seleccione la Unidad</option>
              {[...new Set(unidadesOptions.map((e) => e.siglaUnidadGrupo))].map(
                (unidad) => (
                  <option key={unidad} value={unidad}>
                    {unidad}
                  </option>
                )
              )}
            </select>
          </label>
          <label htmlFor="">
            <span>Nomenclatura</span>
            <select
              required
              {...register("nomenclatura")}
              value={selectedSiglas}
              onChange={(e) => handleSiglasChange(e.target.value)}
            >
              <option value="">Seleccione la Nomenclatura</option>
              {[...new Set(siglasOptions.map((e) => e.nomenclatura))].map(
                (siglas) => (
                  <option key={siglas} value={siglas}>
                    {siglas}
                  </option>
                )
              )}
            </select>
          </label>
          <label htmlFor="">
            <span>Cargo</span>
            <select
              required
              {...register("cargo")}
              value={selectedCargo}
              onChange={(e) => handleCargoChange(e.target.value)}
            >
              <option value="">Seleccione el Cargo</option>
              {[...new Set(cargoOptions.map((e) => e.cargoSiipne))].map(
                (cargo) => (
                  <option key={cargo} value={cargo}>
                    {cargo}
                  </option>
                )
              )}
            </select>
          </label>
          {selectedDireccion === "OTROS" && (
            <label>
              <span>NOMENCLATURA SI ES FUERA DE LA DIGIN</span>
              <input
                type="text"
                {...register("nomenclaturaNoDigin", {
                  required: selectedDireccion === "OTROS",
                })}
              />
            </label>
          )}
          <button>{paseEdit ? "Actualizar" : "Guardar"}</button>
        </form>
        <section>
          <table>
            <thead>
              <tr>
                <th>Nro. TELEGRAMA</th>
                <th>FECHA TELEGRAMA</th>
                <th>DIRECCIÓN</th>
                <th>UNIDAD</th>
                <th>NOMENCLATURA</th>
                <th>CARGO</th>
                <th>NOMENCLATURA FUERA DE LA DIGIN</th>
              </tr>
            </thead>
            <tbody>
              {pase
                ?.slice()
                .reverse()
                .filter((pase) => pase.servidorPolicialId === servidor.id)
                .map((pase) => (
                  <tr key={pase.id}>
                    <td>{pase.numeroTelegrama}</td>
                    <td>{pase.fechaTelegrama}</td>
                    <td>{pase.direccion}</td>
                    <td>{pase.unidad}</td>
                    <td>{pase.nomenclatura}</td>
                    <td>{pase.cargo}</td>
                    <td>{pase.nomenclaturaNoDigin}</td>
                    <td style={{ border: "none" }}>
                      <img
                        src="../../../edit.png"
                        className="btn__expand"
                        onClick={() => handleEditPase(pase)}
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

export default Pases;
