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
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const diasEdicion = import.meta.env.VITE_DIAS_EDICION;
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;
  const userLoggued = JSON.parse(localStorage.user ? localStorage.user : 0);

  const [hide, setHide] = useState(true);
  const [hideDelete, setHideDelete] = useState(true);
  const [idDelete, setIdDelete] = useState("");
  const [desplazamientoEdit, setDesplazamientoEdit] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);
  const [isDisabled3, setIsDisabled3] = useState(false);
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
    setHide(true);
    setIsDisabled(false);
    setIsDisabled2(false);
    setIsDisabled3(false);
  };

  const handleHideDelete = (pase) => {
    setHideDelete(false);
    setIdDelete(pase);
  };

  const handleDelete = () => {
    deleteDesplazamiento(PATH_DESPLAZAMIENTOS, idDelete.id);
    setHideDelete(true);
    alert(`Se elimino el registro"  ${idDelete.nomenclatura}`);
    setIdDelete("");
  };

  const handleEditDesplazamiento = (desplazamiento) => {
    setDesplazamientoEdit(desplazamiento);
    setHide(false);
    if (
      !(
        new Date() - new Date(desplazamiento.createdAt) <
          diasEdicion * 24 * 60 * 60 * 1000 || userCI === superAdmin
      )
    ) {
      setIsDisabled(true);
    }

    if (
      !(
        new Date() - new Date(desplazamiento.updatedAt) <
          diasEdicion * 24 * 60 * 60 * 1000 ||
        !desplazamiento.fechaPresentacion ||
        userCI === superAdmin
      )
    ) {
      setIsDisabled2(true);
    }

    if (
      !(
        new Date() - new Date(desplazamiento.updatedAt) <
          diasEdicion * 24 * 60 * 60 * 1000 ||
        !desplazamiento.fechaFinalización ||
        userCI === superAdmin
      )
    ) {
      setIsDisabled3(true);
    }
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
        <section
          className={`form__container__info ${
            hide && "form__container__info__close"
          }`}
        >
          <form className="form__info" onSubmit={handleSubmit(submit)}>
            <div
              onClick={() => {
                setSelectedDireccion("");
                setSelectedUnidad("");
                setSelectedSiglas("");
                setSelectedCargo("");
                setHide(true);
                setDesplazamientoEdit();
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
              }}
              className="btn__exit__form__info"
            >
              ❌
            </div>
            <label className="label__form">
              <span className="span__form__info">Tipo de Desplazamiento: </span>
              <select
                disabled={isDisabled}
                className="select__form__info"
                required
                {...register("tipoDesplazamiento")}
              >
                <option value="">Seleccione el Tipo</option>
                {variables
                  ?.filter((e) => e.tipoDeDesplazamiento)
                  .map((variable) => (
                    <option
                      key={variable.id}
                      value={variable.tipoDeDesplazamiento}
                    >
                      {variable.tipoDeDesplazamiento}
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
                {...register("numeroDocumento")}
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
              <span className="span__form__info">
                Finalización documento :{" "}
              </span>
              <input
                disabled={isDisabled}
                className="input__form__info"
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
              <p style={{ color: "red" }}>
                {errors.fechaFinalizacionDoc.message}
              </p>
            )}
            <label className="label__form">
              <span className="span__form__info">Dirección</span>
              <select
                disabled={isDisabled}
                className="select__form__info"
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
              <span className="span__form__info">Unidad</span>
              <select
                disabled={isDisabled}
                className="select__form__info"
                required
                {...register("unidad")}
                value={selectedUnidad}
                onChange={(e) => handleUnidadChange(e.target.value)}
              >
                <option value="">Seleccione la Unidad</option>
                {[
                  ...new Set(unidadesOptions.map((e) => e.siglaUnidadGrupo)),
                ].map((unidad) => (
                  <option key={unidad} value={unidad}>
                    {unidad}
                  </option>
                ))}
              </select>
            </label>
            <label className="label__form">
              <span className="span__form__info">Nomenclatura</span>
              <select
                disabled={isDisabled}
                className="select__form__info"
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
              <span className="span__form__info">Cargo</span>
              <select
                disabled={isDisabled}
                className="select__form__info"
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
                <span className="span__form__info">
                  Nomenclatura si es OTROS
                </span>
                <input
                  disabled={isDisabled}
                  className="input__form__info"
                  required
                  type="text"
                  {...register("nomenclaturaNoDigin", {
                    required: selectedDireccion === "OTROS",
                  })}
                />
              </label>
            )}
            <label className="label__form">
              <span className="span__form__info">Causa del Desplazamiento</span>
              <input
                disabled={isDisabled}
                className="input__form__info"
                type="text"
                placeholder="Detalle la Razón del Desplazamiento"
                required
                {...register("causaDesplazamiento")}
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">
                Designado a Plan de Acción:{" "}
              </span>
              <select
                disabled={isDisabled}
                className="select__form__info"
                required
                {...register("verificaPlanAccion")}
              >
                <option value="">Seleccione el Cargo</option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </label>
            {watch("verificaPlanAccion") === "SI" && (
              <>
                <label className="label__form">
                  <span className="span__form__info">Plan de Acción: </span>
                  <select
                    disabled={isDisabled}
                    className="select__form__info"
                    required
                    {...register("planAccion")}
                  >
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

                <Autocompletar
                  servidores={servidores}
                  setValue={setValue}
                  desplazamientoEdit={desplazamientoEdit}
                  isDisabled={isDisabled}
                />
              </>
            )}
            <label className="label__form">
              <span className="span__form__info">Fecha de Presentación: </span>
              <input
                disabled={isDisabled2}
                className="input__form__info"
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
              <span className="span__form__info">Fecha de Finalización: </span>
              <input
                disabled={isDisabled3}
                className="input__form__info"
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
            <button className="btn__form__info">
              {desplazamientoEdit ? "Actualizar" : "Guardar"}
            </button>
          </form>
        </section>
        <section>
          <table className="table__info__desplazamiento">
            <thead>
              <tr>
                <th style={{ border: "none", backgroundColor: "transparent" }}>
                  <img
                    src="../../../new.png"
                    className="btn__table"
                    onClick={() => setHide(false)}
                  />
                </th>
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
                    <td style={{ border: "none", backgroundColor: "transparent" }}>
                      <img
                        src="../../../edit.png"
                        className="btn__table"
                        onClick={() => handleEditDesplazamiento(desplazamiento)}
                      />

                      {userLoggued.cI === superAdmin && (
                        <img
                          src="../../../delete.png"
                          className="btn__table"
                          onClick={() => handleHideDelete(desplazamiento)}
                        />
                      )}
                    </td>
                    <td className="table__td">{desplazamiento.tipoDesplazamiento}</td>
                    <td className="table__td">{desplazamiento.tipoDocumento}</td>
                    <td className="table__td">{desplazamiento.numeroDocumento}</td>
                    <td className="table__td">{desplazamiento.fechaDocumento}</td>
                    <td className="table__td">{desplazamiento.fechaInicio}</td>
                    <td className="table__td">{desplazamiento.fechaFinalizacionDoc}</td>
                    <td className="table__td">{desplazamiento.direccion}</td>
                    <td className="table__td">{desplazamiento.unidad}</td>
                    <td className="table__td">{desplazamiento.nomenclatura}</td>
                    <td className="table__td">{desplazamiento.cargo}</td>
                    <td className="table__td">{desplazamiento.nomenclaturaNoDigin}</td>
                    <td className="table__td">{desplazamiento.causaDesplazamiento}</td>
                    <td className="table__td">{desplazamiento.verificaPlanAccion}</td>
                    <td className="table__td">{desplazamiento.planAccion}</td>
                    <td className="table__td">{desplazamiento.personalRelevo}</td>
                    <td className="table__td">{desplazamiento.fechaPresentacion}</td>
                    <td className="table__td">{desplazamiento.fechaFinalización}</td>
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

export default TipoDesplazamiento;
