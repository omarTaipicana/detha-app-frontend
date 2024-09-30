import React, { useEffect, useState } from "react";
import axios from "axios";
import getConfigToken from "../../services/getConfigToken";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";
import Select from "react-select";
import "./style/FormInfo.css";
import Autocompletar from "./Autocompletar";

const TipoDesplazamiento = ({ servidor }) => {
  const urlBase = import.meta.env.VITE_API_URL;
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;

  const [desplazamientoEdit, setDesplazamientoEdit] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [paseEdit, setPaseEdit] = useState("");

  const [organicos, setOrganicos] = useState([]);
  const [selectedDireccion, setSelectedDireccion] = useState("");
  const [selectedUnidad, setSelectedUnidad] = useState("");
  const [selectedSiglas, setSelectedSiglas] = useState("");
  const [selectedCargo, setSelectedCargo] = useState("");
  const [unidadesOptions, setUnidadesOptions] = useState([]);
  const [siglasOptions, setSiglasOptions] = useState([]);
  const [cargoOptions, setCargoOptions] = useState([]);

  const PATH_DESPLAZAMIENTOS = "/desplazamientos";
  const PATH_VARIABLES = "/variables";
  const PATH_SERVIDORES = "/servidores";
  const [
    desplazamiento,
    getDesplazamiento,
    postDesplazamiento,
    deleteDesplazamiento,
    updateDesplazamiento,
    hasError,
    isLoading,
  ] = useCrud();

  const [variables, getVariables] = useCrud();
  const [servidores, getServidores] = useCrud();
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
    if (desplazamientoEdit) {
      updateDesplazamiento(PATH_DESPLAZAMIENTOS, desplazamientoEdit.id, {
        ...data,
        usuarioEdicion: userCI,
      });
    } else {
      postDesplazamiento(PATH_DESPLAZAMIENTOS, {
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
      tipoDesplazamiento: "",
      tipoDocumento: "",
      numeroDocumento: "",
      fechaDocumento: "",
      fechaInicio: "",
      fechaFinalizacionDoc: "",
      nomenclaturaNoDigin: "",
      causaDesplazamiento: "",
      verificaPlanAccion: "",
      planAccion: "",
      personalRelevo: "",
      fechaPresentacion: "",
      fechaFinalización: "",
    });
    setDesplazamientoEdit("");
  };

  const handleEditDesplazamiento = (desplazamiento) => {
    setDesplazamientoEdit(desplazamiento);
  };

  useEffect(() => {
    if (watch("verificaPlanAccion") === "NO") {
      setValue("planAccion", "");
      setValue("personalRelevo", "");
    }
  }, [watch("verificaPlanAccion"), setValue]);

  useEffect(() => {
    getDesplazamiento(PATH_DESPLAZAMIENTOS);
    getVariables(PATH_VARIABLES);
    getServidores(PATH_SERVIDORES);
    axios
      .get(`${urlBase}/organicos`, getConfigToken())
      .then((res) => setOrganicos(res.data))
      .catch((err) => console.log(err));

    reset(desplazamientoEdit);
    setUnidadesOptions(
      obtenerUnidadesPorDireccion(desplazamientoEdit?.direccion)
    );
    setSiglasOptions(obtenerSiglasPorUnidad(desplazamientoEdit?.unidad));
    setCargoOptions(obtenerCargosPorSigla(desplazamientoEdit?.nomenclatura));

    setSelectedDireccion(desplazamientoEdit?.direccion);
    setSelectedUnidad(desplazamientoEdit?.unidad);
    setSelectedSiglas(desplazamientoEdit?.nomenclatura);
    setSelectedCargo(desplazamientoEdit?.cargo);
  }, [desplazamientoEdit]);

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
        <span>TIPO DE DESPLAZAMIENTO</span>
      </article>
      <form onSubmit={handleSubmit(submit)}>
        <label className="label__form">
          <span>Tipo de Desplazamiento: </span>
          <select required {...register("tipoDesplazamiento")}>
            <option value="">Seleccione el Tipo</option>
            {variables
              ?.filter((e) => e.tipoDeDesplazamiento)
              .map((variable) => (
                <option key={variable.id} value={variable.tipoDeDesplazamiento}>
                  {variable.tipoDeDesplazamiento}
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
          <input type="text" required {...register("numeroDocumento")} />
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
          <span>Fecha de Finalización según el documento: </span>
          <input
            required
            type="date"
            {...register("fechaFinalizacionDoc", {
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
        {errors.fechaFinalizacionDoc && (
          <p style={{ color: "red" }}>{errors.fechaFinalizacionDoc.message}</p>
        )}
        <label className="label__form">
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
        <label className="label__form">
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
        <label className="label__form">
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
        <label className="label__form">
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
          <label className="label__form">
            <span>Nomenclatura si es fuera de la DIGIN</span>
            <input
              required
              type="text"
              {...register("nomenclaturaNoDigin", {
                required: selectedDireccion === "OTROS",
              })}
            />
          </label>
        )}
        <label className="label__form">
          <span>Causa del Desplazamiento</span>
          <input
            type="text"
            placeholder="Detalle la Razón del Desplazamiento"
            required
            {...register("causaDesplazamiento")}
          />
        </label>
        <label className="label__form">
          <span>Designado al cumplimiento de un Plan de Acción: </span>
          <select required {...register("verificaPlanAccion")}>
            <option value="">Seleccione el Cargo</option>
            <option value="SI">SI</option>
            <option value="NO">NO</option>
          </select>
        </label>
        {watch("verificaPlanAccion") === "SI" && (
          <>
            <label className="label__form">
              <span>Plan de Acción: </span>
              <select required {...register("planAccion")}>
                <option value="">Seleccione el Plan</option>
                {variables
                  ?.filter((e) => e.planAccion)
                  .map((variable) => (
                    <option key={variable.id} value={variable.planAccion}>
                      {variable.planAccion}
                    </option>
                  ))}
              </select>
            </label>

            <Autocompletar servidores={servidores} setValue={setValue} />
          </>
        )}
        <label className="label__form">
          <span>Fecha de Presentación: </span>
          <input
            type="date"
            {...register("fechaPresentacion", {
              setValueAs: (value) => (value === "" ? null : value),
              validate: (value) => {
                if (!value) return true;
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
        {errors.fechaPresentacion && (
          <p style={{ color: "red" }}>{errors.fechaPresentacion.message}</p>
        )}

        <label className="label__form">
          <span>Fecha de Finalización: </span>
          <input
            type="date"
            {...register("fechaFinalización", {
              setValueAs: (value) => (value === "" ? null : value),
              validate: (value) => {
                if (!value) return true;
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
        {errors.fechaFinalización && (
          <p style={{ color: "red" }}>{errors.fechaFinalización.message}</p>
        )}
        <button>{desplazamientoEdit ? "Actualizar" : "Guardar"}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>DESPLAZAMIENTO</th>
            <th>DOCUMENTO</th>
            <th>NUM DOCUMENTO</th>
            <th>FECHA DOCUMENTO</th>
            <th>FECHA INICIO</th>
            <th>FECHA FIN</th>
            <th>DIRECCIÓN</th>
            <th>UNIDAD</th>
            <th>NOMENCLATURA</th>
            <th>CARGO</th>
            <th>NOMENCLATURA FUERA DE LA DIGIN</th>
            <th>CAUSA</th>
            <th>DESIGNADO A UN PLAN</th>
            <th>PLAN DE ACCIÓN</th>
            <th>PERSONAL RELEVO</th>
            <th>FECHA PRESENTACIÓN</th>
            <th>FECHA FINALIZACIÓN</th>
          </tr>
        </thead>
        <tbody>
          {desplazamiento
            ?.slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .filter(
              (desplazamiento) =>
                desplazamiento.servidorPolicialId === servidor.id
            )
            .map((desplazamiento) => (
              <tr key={desplazamiento.id}>
                <td>{desplazamiento.tipoDesplazamiento}</td>
                <td>{desplazamiento.tipoDocumento}</td>
                <td>{desplazamiento.numeroDocumento}</td>
                <td>{desplazamiento.fechaDocumento}</td>
                <td>{desplazamiento.fechaInicio}</td>
                <td>{desplazamiento.fechaFinalizacionDoc}</td>
                <td>{desplazamiento.direccion}</td>
                <td>{desplazamiento.unidad}</td>
                <td>{desplazamiento.nomenclatura}</td>
                <td>{desplazamiento.cargo}</td>
                <td>{desplazamiento.nomenclaturaNoDigin}</td>
                <td>{desplazamiento.causaDesplazamiento}</td>
                <td>{desplazamiento.verificaPlanAccion}</td>
                <td>{desplazamiento.planAccion}</td>
                <td>{desplazamiento.personalRelevo}</td>
                <td>{desplazamiento.fechaPresentacion}</td>
                <td>{desplazamiento.fechaFinalización}</td>
                <td style={{ border: "none" }}>
                  <img
                    src="../../../edit.png"
                    className="btn__expand"
                    onClick={() => handleEditDesplazamiento(desplazamiento)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TipoDesplazamiento;
