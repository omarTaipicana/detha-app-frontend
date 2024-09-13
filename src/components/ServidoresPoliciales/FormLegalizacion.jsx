import React, { useEffect, useState } from "react";
import "./style/FormLegalizacion.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import getConfigToken from "../../services/getConfigToken";

const FormLegalizacion = () => {
    const [selectedDireccion, setSelectedDireccion] = useState("");
    const [selectedUnidad, setSelectedUnidad] = useState("");
    const [selectedSiglas, setSelectedSiglas] = useState("");
    const [selectedCargo, setSelectedCargo] = useState("");
    const [unidadesOptions, setUnidadesOptions] = useState([]);
    const [siglasOptions, setSiglasOptions] = useState([]);
    const [cargoOptions, setCargoOptions] = useState([]);
  
    const urlBase = import.meta.env.VITE_API_URL;
    const { register, handleSubmit, reset } = useForm();
    const [registerUser, , , , err, isLoading, users, , updateUser] = useAuth();
    const [userEdit, setUserEdit] = useState();
    const [formIsClouse, setFormIsClouse] = useState(true);
    const [organicos, setOrganicos] = useState([]);
    const userRol = JSON.parse(localStorage.user).rol;
    const useCI = JSON.parse(localStorage.user).cI;
  
    const submit = (data) => {
      const body = {
        cI: data.cI,
        email: data.email,
        enabled:
          data.enabled === "true"
            ? true
            : data.enabled === "false"
            ? false
            : undefined,
        firstName: data.firstName,
        lastName: data.lastName,
        direccion: data.direccion,
        unidad: data.unidad,
        nomenclature: data.nomenclature,
        cargo: data.cargo,
        rol: data.rol,
      };
  
      if (userEdit) {
        // updateUser(body, userEdit.id);
        setUserEdit();
      } else {
        registerUser(body);
      }
  
      setFormIsClouse(true);
      setSelectedDireccion("");
      setSelectedUnidad("");
      setSelectedSiglas("");
      setSelectedCargo("");
      reset({
        cI: "",
        email: "",
        firstName: "",
        lastName: "",
      });
    };
  
    useEffect(() => {
      axios
        .get(`${urlBase}/organicos`, getConfigToken())
        .then((res) => setOrganicos(res.data))
        .catch((err) => console.log(err));
  
      reset(userEdit);
  
      setUnidadesOptions(obtenerUnidadesPorDireccion(userEdit?.direccion));
      setSiglasOptions(obtenerSiglasPorUnidad(userEdit?.unidad));
      setCargoOptions(obtenerCargosPorSigla(userEdit?.nomenclature));
  
      setSelectedDireccion(userEdit?.direccion);
      setSelectedUnidad(userEdit?.unidad);
      setSelectedSiglas(userEdit?.nomenclature);
      setSelectedCargo(userEdit?.cargo);
    }, [userEdit]);
  
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
    };
  
    const handleUnidadChange = (selected) => {
      setSelectedUnidad(selected);
      const siglasByUnidad = obtenerSiglasPorUnidad(selected);
      setSiglasOptions(siglasByUnidad);
      setSelectedSiglas("");
      setSelectedCargo("");
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
        <button
          onClick={() => {
            setFormIsClouse(false);
          }}
          className="cerate__user__btn"
        >
          + Registrar Talento Humano
        </button>
  
        <div className={`form__container ${formIsClouse && "form__close"}`}>
          <form className="create__user__form" onSubmit={handleSubmit(submit)}>
            <h2 className="title__create__user__card">
              {userEdit ? "Actualize el Registro del Servidor Policial" : "Registre un Servidor Policial"}
            </h2>
            <div
              onClick={() => {
                setFormIsClouse(true);
                setUserEdit();
                reset({
                  cI: "",
                  email: "",
                  firstName: "",
                  lastName: "",
                  password: "",
                  nomenclature: "",
                });
              }}
              className="form__exit"
            >
              ❌
            </div>
            <label
              style={{
                display:
                  !userEdit ||
                  userRol === "Administrador" ||
                  useCI === "0503627234"
                    ? "flex"
                    : "none",
              }}
              className="label__create__user__card"
            >
              <span className="span__create__user__card">Cedula:</span>
              <input
                className="input__create__user__card"
                {...register("cI")}
                type="text"
                required
              />
            </label>
            <label
              style={{
                display:
                  !userEdit ||
                  userRol === "Administrador" ||
                  useCI === "0503627234"
                    ? "flex"
                    : "none",
              }}
              className="label__create__user__card"
            >
              <span className="span__create__user__card">Email:</span>
              <input
                {...register("email")}
                className="input__create__user__card"
                id="email"
                type="email"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                required
              />
            </label>
            <label className="label__create__user__card">
              <span className="span__create__user__card">Nombres:</span>
              <input
                className="input__create__user__card"
                {...register("firstName")}
                type="text"
                required
              />
            </label>
            <label className="label__create__user__card">
              <span className="span__create__user__card">Apellidos:</span>
              <input
                className="input__create__user__card"
                {...register("lastName")}
                type="text"
                required
              />
            </label>
  
            <label className="label__create__user__card">
              <span className="span__create__user__card">Dirección:</span>
              <select
                {...register("direccion")}
                required
                className="input__create__user__card"
                value={selectedDireccion}
                onChange={(e) => handleDireccionChange(e.target.value)}
              >
                <option value="">Seleccione una dirección</option>
                {[...new Set(organicos.map((e) => e.siglasDireccion))].map(
                  (direccion) => (
                    <option key={direccion} value={direccion}>
                      {direccion}
                    </option>
                  )
                )}
              </select>
            </label>
  
            <label className="label__create__user__card">
              <span className="span__create__user__card">Unidad:</span>
              <select
                {...register("unidad")}
                required
                className="input__create__user__card"
                value={selectedUnidad}
                onChange={(e) => handleUnidadChange(e.target.value)}
              >
                <option value="">Seleccione una unidad</option>
                {[...new Set(unidadesOptions.map((e) => e.siglaUnidadGrupo))].map(
                  (unidad) => (
                    <option key={unidad} value={unidad}>
                      {unidad}
                    </option>
                  )
                )}
              </select>
            </label>
  
            <label className="label__create__user__card">
              <span className="span__create__user__card">Nomenclatura:</span>
              <select
                {...register("nomenclature")}
                required
                className="input__create__user__card"
                value={selectedSiglas}
                onChange={(e) => handleSiglasChange(e.target.value)}
              >
                <option value="">Seleccione la nomenclatura de pase</option>
                {[...new Set(siglasOptions.map((e) => e.nomenclatura))].map(
                  (siglas) => (
                    <option key={siglas} value={siglas}>
                      {siglas}
                    </option>
                  )
                )}
              </select>
            </label>
  
            <label className="label__create__user__card">
              <span className="span__create__user__card">Cargo:</span>
              <select
                {...register("cargo")}
                required
                className="input__create__user__card"
                value={selectedCargo}
                onChange={(e) => handleCargoChange(e.target.value)}
              >
                <option value="">Seleccione el cargo</option>
                {[...new Set(cargoOptions.map((e) => e.cargoSiipne))].map(
                  (cargo) => (
                    <option key={cargo} value={cargo}>
                      {cargo}
                    </option>
                  )
                )}
              </select>
            </label>
  
            <label className="label__create__user__card">
              <span className="span__create__user__card">Habilitado:</span>
              <select
                className="input__create__user__card"
                name="rol"
                id="rol"
                {...register("enabled")}
              >
                <option value="true">Habilitado</option>
                <option value="false">Deshabilitado</option>
              </select>
            </label>
            <label
              className="label__create__user__card"
              style={{
                display:
                  userRol === "Administrador" || useCI === "0503627234"
                    ? "flex"
                    : "none",
              }}
            >
              <span className="span__create__user__card">Rol de Usuario:</span>
              <select
                className="input__create__user__card"
                name="rol"
                id="rol"
                {...register("rol")}
              >
                <option value="Asistente de TH">Asistente de TH</option>
                <option value="Sub-Administrador">Sub-Administrador</option>
                <option
                  style={{
                    display: useCI === "0503627234" ? "flex" : "none",
                  }}
                  value="Administrador"
                >
                  Administrador
                </option>
              </select>
            </label>
            <button className="create__user__card__btn">
              {userEdit ? "ACTUALIZAR" : "GUARDAR"}
            </button>
          </form>
        </div>
      </div>
    );
  };

export default FormLegalizacion