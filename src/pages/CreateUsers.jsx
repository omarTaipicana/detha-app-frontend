import { useEffect, useState } from "react";
import "./styles/CreateUsers.css";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import IsLoading from "../components/HomePage/IsLoading";
import UsersList from "../components/CreateUsers/UsersList";
import axios from "axios";
import getConfigToken from "../services/getConfigToken";

const CreateUsers = () => {
  const [selectedDireccion, setSelectedDireccion] = useState("");
  const [selectedUnidad, setSelectedUnidad] = useState("");
  const [selectedUnidadSubzona, setSelectedUnidadSubzona] = useState("");
  const [tipoDesignacion, setTipoDesignacion] = useState("");
  const [unidadesOptions, setUnidadesOptions] = useState([]);
  const [unidadSubzonaOptions, setUnidadSubzonaOptions] = useState([]);

  const urlBase = import.meta.env.VITE_API_URL;
  const { register, handleSubmit, reset } = useForm();
  const [registerUser, , , , err, isLoading, users, , updateUser] = useAuth();
  const [userEdit, setUserEdit] = useState();
  const [formIsClouse, setFormIsClouse] = useState(true);
  const [organicos, setOrganicos] = useState([]);
  const userRol = JSON.parse(localStorage.user).rol;
  const useCI = JSON.parse(localStorage.user).cI;

  const submit = (data) => {
    const frontBaseUrl = `${location.protocol}//${location.host}/#/reset_password`;
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
      frontBaseUrl: frontBaseUrl,
      lastName: data.lastName,
      direccion: data.direccion,
      unidad: data.unidad,
      unidadSubzona: data.unidadSubzona,
      tipoDesignacion: tipoDesignacion,
      rol: data.rol,
    };

    if (userEdit) {
      updateUser(body, userEdit.id);
      setUserEdit();
    } else {
      registerUser(body);
    }

    setFormIsClouse(true);
    setSelectedDireccion("");
    setSelectedUnidad("");
    setSelectedUnidadSubzona("");
    setTipoDesignacion("");
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
    setUnidadSubzonaOptions(obtenerSiglasPorUnidad(userEdit?.unidad));
    setTipoDesignacion(obtenerTipoAsignacion(userEdit?.unidadSubzona));

    setSelectedDireccion(userEdit?.direccion);
    setSelectedUnidad(userEdit?.unidad);
    setSelectedUnidadSubzona(userEdit?.unidadSubzona);
  }, [userEdit]);

  const obtenerUnidadesPorDireccion = (siglasDireccion) => {
    return organicos.filter((item) => item.siglasDireccion === siglasDireccion);
  };
  const obtenerSiglasPorUnidad = (siglaUnidadGrupo) => {
    return organicos.filter(
      (item) => item.siglaUnidadGrupo === siglaUnidadGrupo
    );
  };

  const obtenerTipoAsignacion = (unidadSubzona) => {
    const item = organicos.find((item) => item.unidadSubzona === unidadSubzona);
    return item ? item.tipoDesignacion : "";
  };

  const handleDireccionChange = (selected) => {
    setSelectedDireccion(selected);
    const unidadesByDireccion = obtenerUnidadesPorDireccion(selected);
    setUnidadesOptions(unidadesByDireccion);
    setSelectedUnidad("");
    setSelectedUnidadSubzona("");
    setTipoDesignacion("");
  };

  const handleUnidadChange = (selected) => {
    setSelectedUnidad(selected);
    const siglasByUnidad = obtenerSiglasPorUnidad(selected);
    setUnidadSubzonaOptions(siglasByUnidad);
    setSelectedUnidadSubzona("");
    setTipoDesignacion("");
  };

  const handleUnidadSubzona = (selected) => {
    setSelectedUnidadSubzona(selected);
    setTipoDesignacion(obtenerTipoAsignacion(selected));
  };

  return (
    <div>
      {isLoading && <IsLoading />}
      <div className="create__users__list__users">
        <span className="text__err">
          {err?.response?.data?.message ===
          "llave duplicada viola restricción de unicidad «users_cI_key»"
            ? "Ya existe un usuario registrado con este número de cédula"
            : err?.response?.data?.message ===
              "llave duplicada viola restricción de unicidad «users_email_key»"
            ? "Ya existe un usuario registrado con este correo electrónico"
            : err?.cI
            ? `Se creo el usuario para ${err?.firstName} ${err?.lastName} `
            : err?.response.data.message}
        </span>
        <button
          onClick={() => {
            setFormIsClouse(false);
          }}
          className="cerate__user__btn"
        >
          + Crear Nuevo Usuario
        </button>
        <div className={`form__container ${formIsClouse && "form__close"}`}>
          <form className="create__user__form" onSubmit={handleSubmit(submit)}>
            <h2 className="title__create__user__card">
              {userEdit ? "Actualize el Usuario" : "Crear nuevo Usuario"}
            </h2>
            <div
              onClick={() => {
                setFormIsClouse(true);
                setUserEdit();
                setSelectedDireccion("");
                setSelectedUnidad("");
                setSelectedUnidadSubzona("");
                setTipoDesignacion("");
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
                {[
                  ...new Set(unidadesOptions.map((e) => e.siglaUnidadGrupo)),
                ].map((unidad) => (
                  <option key={unidad} value={unidad}>
                    {unidad}
                  </option>
                ))}
              </select>
            </label>

            <label className="label__create__user__card">
              <span className="span__create__user__card">Control:</span>
              <select
                {...register("unidadSubzona")}
                required
                className="input__create__user__card"
                value={selectedUnidadSubzona}
                onChange={(e) => handleUnidadSubzona(e.target.value)}
              >
                <option value="">Seleccione el alcance de control</option>
                {[
                  ...new Set(unidadSubzonaOptions.map((e) => e.unidadSubzona)),
                ].map((siglas) => (
                  <option key={siglas} value={siglas}>
                    {siglas}
                  </option>
                ))}
              </select>
            </label>

            <label
              style={{
                display: "none",
              }}
              disabled
              className="label__create__user__card"
            >
              <span className="span__create__user__card">
                Tipo Designación:
              </span>
              <input
                value={tipoDesignacion}
                className="input__create__user__card"
                {...register("tipoDesignacion")}
                type="text"
                required
                readOnly
              />
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
        <section>
          <UsersList
            userUpdated={users}
            setUserEdit={setUserEdit}
            setFormIsClouse={setFormIsClouse}
          />
        </section>
      </div>
    </div>
  );
};

export default CreateUsers;
