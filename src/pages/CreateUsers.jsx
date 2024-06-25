import { useEffect, useState } from "react";
import "./styles/CreateUsers.css";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import IsLoading from "../components/HomePage/IsLoading";
import UsersList from "../components/CreateUsers/UsersList";

const CreateUsers = () => {
  const { register, handleSubmit, reset } = useForm();
  const [registerUser, , , , err, isLoading, users, , updateUser] = useAuth();
  const [userEdit, setUserEdit] = useState();
  const [formIsClouse, setFormIsClouse] = useState(true);
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
      nomenclature: data.nomenclature,
      rol: data.rol,
    };

    if (userEdit) {
      updateUser(body, userEdit.id);
      setUserEdit();
    } else {
      registerUser(body);
    }

    setFormIsClouse(true);
    reset({
      cI: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      nomenclature: "",
    });
  };

  useEffect(() => {
    reset(userEdit);
  }, [userEdit]);

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
              <span className="span__create__user__card">Nomenclatura:</span>
              <input
                className="input__create__user__card"
                {...register("nomenclature")}
                type="text"
                required
              />
            </label>
            <label className="label__create__user__card">
              <span className="span__create__user__card">Habilitado:</span>
              <select name="rol" id="rol" {...register("enabled")}>
                <option className="input__create__user__card" value="true">
                  Habilitado
                </option>
                <option className="input__create__user__card" value="false">
                  Deshabilitado
                </option>
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
              <select name="rol" id="rol" {...register("rol")}>
                <option
                  className="input__create__user__card"
                  value="Asistente de TH"
                >
                  Asistente de TH
                </option>
                <option
                  className="input__create__user__card"
                  value="Sub-Administrador"
                >
                  Sub-Administrador
                </option>
                <option
                  style={{
                    display: useCI === "0503627234" ? "flex" : "none",
                  }}
                  className="input__create__user__card"
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
