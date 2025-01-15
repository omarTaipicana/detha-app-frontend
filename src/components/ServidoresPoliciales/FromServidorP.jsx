import React, { useEffect, useState } from "react";
import "./style/FormServidorP.css";
import { useForm } from "react-hook-form";
import useCrud from "../../hooks/useCrud";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/states/alert.slice";
import useAuth from "../../hooks/useAuth";

const FromServidorP = ({
  formIsClouse,
  setFormIsClouse,
  servidorEdit,
  setServidorEdit,
}) => {
  const [, , , , , , , , , , , getUserLogged, user] = useAuth();
  const userCI = user?.cI;
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;
  const PATH_SERVIDORES = "/servidores";
  const PATH_SENPLADES = "/senplades";
  const PATH_VARIABLES = "/variables";
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, value, setValue, watch } = useForm();
  const [
    response,
    getApi,
    postApi,
    deleteApi,
    updateApi,
    hasError,
    isLoading,
    newReg,
    deleteReg,
    updateReg,
  ] = useCrud();
  const [senplades, getSenplades, , , , ,] = useCrud();
  const [estadoCivil, getEstadoCivil, , , , ,] = useCrud();
  const [tipoDiscapacidad, getTipoDiscapacidad, , , , ,] = useCrud();
  const [etnia, getEtnia, , , , ,] = useCrud();
  const userRol = user?.rol;
  const useCI = user?.cI;

  const [cantonesOption, setCantonesOption] = useState([]);
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedCanton, setSelectedCanton] = useState("");
  const [selectedEstadoCivil, setSelectedEstadoCivil] = useState("");
  const [selectedTipoDiscapacidad, setSelectedTipoDiscapacidad] = useState("");
  const [selectedEtnia, setSelectedEtnia] = useState("");

  const submit = (data) => {
    if (servidorEdit) {
      updateApi(PATH_SERVIDORES, servidorEdit.id, {
        ...data,
        usuarioEdición: userCI,
      });
    } else {
      postApi(PATH_SERVIDORES, {
        ...data,
        usuarioRegistro: userCI,
        usuarioEdicion: userCI,
      });
    }

    setFormIsClouse(true);
    setSelectedProvincia("");
    setSelectedCanton("");
    setSelectedEstadoCivil("");
    setSelectedTipoDiscapacidad("");
    setSelectedEtnia("");
    reset({
      cI: "",
      nombres: "",
      apellidos: "",
      fechaNacimiento: "",
      fechaIngreso: "",
      provinciaResidencia: "",
      cantonResidencia: "",
      direccionResidencia: "",
      estadoCivil: "",
      etnia: "",
      acreditado: "",
      alertaDiscapacidad: "",
      tipoDiscapacidad: "",
      porcentajeDiscapacidad: "",
      detalleDiscapacidad: "",
      alertaEnfermedadCatastrofica: "",
      detalleEnfermedad: "",
    });
    setServidorEdit();
  };

  useEffect(() => {
    getUserLogged();
    getSenplades(PATH_SENPLADES);
    getEstadoCivil(PATH_VARIABLES);
    getTipoDiscapacidad(PATH_VARIABLES);
    getEtnia(PATH_VARIABLES);
    reset(servidorEdit);

    setSelectedProvincia(servidorEdit?.provinciaResidencia);
    setCantonesOption(
      obtenerCantonesPorProvincia(servidorEdit?.provinciaResidencia)
    );
    setSelectedCanton(servidorEdit?.cantonResidencia);
    setSelectedEstadoCivil(servidorEdit?.estadoCivil);
    setSelectedEtnia(servidorEdit?.etnia);
    setSelectedTipoDiscapacidad(servidorEdit?.tipoDiscapacidad);
  }, [servidorEdit]);

  const senpladesVal = senplades ? senplades : [];

  const obtenerCantonesPorProvincia = (provincia) => {
    return senpladesVal.filter((item) => item.provincia === provincia);
  };

  const handleProvinciaChange = (selected) => {
    setSelectedProvincia(selected);
    const cantonesByProvinca = obtenerCantonesPorProvincia(selected);
    setCantonesOption(cantonesByProvinca);
  };

  useEffect(() => {
    if (watch("alertaDiscapacidad") === "NO") {
      setValue("detalleDiscapacidad", "NINGUNA");
      setValue("tipoDiscapacidad", "NINGUNA");
      setValue("porcentajeDiscapacidad", 0);
    } else if (watch("alertaDiscapacidad") === "SI" && servidorEdit) {
      setValue("detalleDiscapacidad", servidorEdit?.detalleDiscapacidad);
      setValue("tipoDiscapacidad", servidorEdit?.tipoDiscapacidad);
      setValue("porcentajeDiscapacidad", servidorEdit?.porcentajeDiscapacidad);
    } else {
      setValue("detalleDiscapacidad", "");
      setValue("tipoDiscapacidad", "");
      setValue("porcentajeDiscapacidad", "");
      setSelectedTipoDiscapacidad("");
    }
  }, [watch("alertaDiscapacidad"), setValue]);

  useEffect(() => {
    if (watch("alertaEnfermedadCatastrofica") === "NO") {
      setValue("detalleEnfermedad", "NINGUNA");
    } else if (watch("alertaEnfermedadCatastrófica") === "SI" && servidorEdit) {
      setValue("detalleEnfermedad", servidorEdit?.detalleEnfermedad);
    } else {
      setValue("detalleEnfermedad", "");
    }
  }, [watch("alertaEnfermedadCatastrofica"), setValue]);

  useEffect(() => {
    if (newReg) {
      dispatch(
        showAlert({
          message: `⚠️ Se creó el Registro del Servidor Policial ${newReg?.nombres} ${newReg?.apellidos} exitosamente`,
          alertType: 2,
        })
      );
    }
  }, [newReg]);

  useEffect(() => {
    if (updateReg) {
      dispatch(
        showAlert({
          message: `⚠️ Se actualizo la información del Servidor Policial ${updateReg?.nombres} ${updateReg?.apellidos} exitosamente`,
          alertType: 2,
        })
      );
    }
  }, [updateReg]);

  return (
    <div>
      <div
        className={`form__container__servidor ${formIsClouse && "form__close"}`}
      >
        <form
          className="create__servidor__form"
          onSubmit={handleSubmit(submit)}
        >
          <h2 className="title__create__servidor__card">
            {servidorEdit
              ? "Actualice Información del Servidor Policial"
              : "Registro de Servidor Policial"}
          </h2>
          <div
            onClick={() => {
              setFormIsClouse(true);
              setServidorEdit();
              setSelectedProvincia("");
              setSelectedCanton("");
              setSelectedEstadoCivil("");
              setSelectedTipoDiscapacidad("");
              setSelectedEtnia("");
              reset({
                cI: "",
                nombres: "",
                apellidos: "",
                fechaNacimiento: "",
                fechaIngreso: "",
                provinciaResidencia: "",
                cantonResidencia: "",
                direccionResidencia: "",
                estadoCivil: "",
                etnia: "",
                acreditado: "",
                alertaDiscapacidad: "",
                tipoDiscapacidad: "",
                porcentajeDiscapacidad: "",
                detalleDiscapacidad: "",
                alertaEnfermedadCatastrofica: "",
                detalleEnfermedad: "",
              });
            }}
            className="card__exit"
          >
            ❌
          </div>

          <section className="form__create__servidor__seccion__continer">
            <section className="form__create__servidor__seccion">
              <label
                style={{
                  display:
                    !servidorEdit ||
                    userRol === rolAdmin ||
                    useCI === superAdmin
                      ? "flex"
                      : "none",
                }}
                className="label__create__servidor__card"
              >
                <span className="span__create__servidor__card">Cedula:</span>
                <input
                  className="input__create__servidor__card"
                  {...register("cI")}
                  type="text"
                  placeholder="Número de Cédula"
                  required
                />
              </label>
              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">Nombres:</span>
                <input
                  className="input__create__servidor__card"
                  {...register("nombres")}
                  type="text"
                  placeholder="Nombres del Servidor Policial"
                  required
                />
              </label>
              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">Apellidos:</span>
                <input
                  className="input__create__servidor__card"
                  {...register("apellidos")}
                  type="text"
                  placeholder="Apellidos del Servidor Policial"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Fecha de Nacimiento:
                </span>
                <input
                  className="input__create__servidor__card"
                  {...register("fechaNacimiento")}
                  type="date"
                  placeholder="Registre la Fecha de Nacimiento"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Fecha de Ingreso a la PPNN:
                </span>
                <input
                  className="input__create__servidor__card"
                  {...register("fechaIngreso")}
                  type="date"
                  placeholder="Registre la Fecha de Ingreso a la Institución"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">Provincia:</span>

                <select
                  {...register("provinciaResidencia")}
                  required
                  className="input__create__servidor__card"
                  value={selectedProvincia}
                  onChange={(e) => handleProvinciaChange(e.target.value)}
                >
                  <option value="">
                    Seleccione la Provincia de residencia
                  </option>
                  {[...new Set(senplades?.map((e) => e.provincia))].map(
                    (provincia) => (
                      <option key={provincia} value={provincia}>
                        {provincia}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">Cantón:</span>

                <select
                  {...register("cantonResidencia")}
                  required
                  className="input__create__servidor__card"
                  value={selectedCanton}
                  onChange={(e) => setSelectedCanton(e.target.value)}
                >
                  <option value="">Seleccione el Cantón de residencia</option>
                  {[...new Set(cantonesOption.map((e) => e.canton))].map(
                    (canton) => (
                      <option key={canton} value={canton}>
                        {canton}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">Dirección:</span>
                <input
                  className="input__create__servidor__card"
                  {...register("direccionResidencia")}
                  type="text"
                  placeholder="Dirección domiciliaria"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Estado Civil:
                </span>

                <select
                  {...register("estadoCivil")}
                  required
                  className="input__create__servidor__card"
                  value={selectedEstadoCivil}
                  onChange={(e) => setSelectedEstadoCivil(e.target.value)}
                >
                  <option value="">Seleccione el estado civil</option>
                  {estadoCivil
                    .filter((e) => e.estadoCivil)
                    .map((estadoCivil) => (
                      <option
                        key={estadoCivil.id}
                        value={estadoCivil.estadoCivil}
                      >
                        {estadoCivil.estadoCivil}
                      </option>
                    ))}
                </select>
              </label>
            </section>

            <section className="form__create__servidor__seccion">
              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">Etnia:</span>

                <select
                  {...register("etnia")}
                  required
                  className="input__create__servidor__card"
                  value={selectedEtnia}
                  onChange={(e) => setSelectedEtnia(e.target.value)}
                >
                  <option value="">Seleccione la etnia del servidor</option>
                  {etnia
                    ?.filter((e) => e.etnia)
                    .map((etnia) => (
                      <option key={etnia.id} value={etnia.etnia}>
                        {etnia.etnia}
                      </option>
                    ))}
                </select>
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Acreditado:
                </span>
                <select
                  className="input__create__servidor__card"
                  {...register("acreditado")}
                  type="text"
                  placeholder="Acreditado"
                  required
                >
                  <option value="">Seleccione Si / No tiene Aceditación</option>
                  <option value="NO">NO</option>
                  <option value="SI">SI</option>
                </select>
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Alerta de Discapacidad:
                </span>
                <select
                  className="input__create__servidor__card"
                  {...register("alertaDiscapacidad")}
                  type="text"
                  placeholder="Alerta de Discapacidad"
                  required
                >
                  <option value="">
                    Seleccione Si / No tiene alerta de Discapacidad
                  </option>
                  <option value="NO">NO</option>
                  <option value="SI">SI</option>
                </select>
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Tipo de Discapacidad:
                </span>

                <select
                  {...register("tipoDiscapacidad")}
                  required
                  className="input__create__servidor__card"
                  value={
                    watch("alertaDiscapacidad") !== "NO"
                      ? selectedTipoDiscapacidad || ""
                      : "NINGUNA"
                  }
                  onChange={(e) => setSelectedTipoDiscapacidad(e.target.value)}
                >
                  <option value="">Seleccione el estado civil</option>
                  {tipoDiscapacidad
                    ?.filter((e) => e.discapacidad)
                    .map((discapacidad) => (
                      <option
                        key={discapacidad.id}
                        value={discapacidad.discapacidad}
                      >
                        {discapacidad.discapacidad}
                      </option>
                    ))}
                </select>
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Porcentaje de Discapacidad:
                </span>
                <input
                  className="input__create__servidor__card"
                  {...register("porcentajeDiscapacidad")}
                  type="number"
                  value={
                    watch("alertaDiscapacidad") !== "NO"
                      ? watch("porcentajeDiscapacidad") || ""
                      : 0
                  }
                  onChange={(e) => {
                    if (watch("alertaDiscapacidad") !== "NO") {
                      const value = e.target.value;
                      setValue("porcentajeDiscapacidad", Math.min(value, 100));
                    } else {
                      setValue("porcentajeDiscapacidad", 0);
                    }
                  }}
                  placeholder="Porcentaje de Discapacidad"
                  step="0.01"
                  max="100"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Detalle de Discapacidad:
                </span>
                <input
                  className="input__create__servidor__card"
                  {...register("detalleDiscapacidad")}
                  type="text"
                  value={
                    watch("alertaDiscapacidad") !== "NO"
                      ? watch("detalleDiscapacidad") || ""
                      : "NINGUNA"
                  }
                  onChange={(e) => {
                    if (watch("alertaDiscapacidad") !== "NO") {
                      setValue("detalleDiscapacidad", e.target.value);
                    } else {
                      setValue("detalleDiscapacidad", "NINGUNA");
                    }
                  }}
                  placeholder="Detalle de Discapacidad"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Alerta de Enfermedad Catastrófica:
                </span>
                <select
                  className="input__create__servidor__card"
                  {...register("alertaEnfermedadCatastrofica")}
                  type="text"
                  placeholder="Alerta de Enfermedad Catastrófica"
                  required
                >
                  <option value="">
                    Seleccione Si / No tiene alerta de Enfermedad Catastrófica
                  </option>
                  <option value="NO">NO</option>
                  <option value="SI">SI</option>
                </select>
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Detalle de Enfermedad Catastrófica:
                </span>
                <input
                  className="input__create__servidor__card"
                  {...register("detalleEnfermedad")}
                  type="text"
                  value={
                    watch("alertaEnfermedadCatastrofica") !== "NO"
                      ? watch("detalleEnfermedad") || ""
                      : "NINGUNA"
                  }
                  onChange={(e) => {
                    if (watch("alertaEnfermedadCatastrofica") !== "NO") {
                      setValue("detalleEnfermedad", e.target.value);
                    } else {
                      setValue("detalleEnfermedad", "NINGUNA");
                    }
                  }}
                  placeholder="Detalle de Enfermedad Catastrófica"
                  required
                />
              </label>
            </section>
          </section>
          <button className="create__servidor__card__btn">
            {servidorEdit ? "ACTUALIZAR" : "GUARDAR"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FromServidorP;
