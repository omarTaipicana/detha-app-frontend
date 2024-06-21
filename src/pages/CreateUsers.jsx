import { useEffect, useState } from "react";
import "./styles/CreateUsers.css";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import IsLoading from "../components/HomePage/IsLoading";
import UsersList from "../components/CreateUsers/UsersList";

const CreateUsers = () => {
  const { register, handleSubmit, reset } = useForm();
  const [registerUser, , , , err, isLoading] = useAuth();

  const userRol = JSON.parse(localStorage.user).rol;

  const submit = (data) => {
    const frontBaseUrl = `${location.protocol}//${location.host}/#/reset_password`;
    // const body = { ...data, frontBaseUrl };
    const body = {
      cI: data.cI,
      email: data.email,
      enabled: data.enabled === "true" ? true : false,
      firstName: data.firstName,
      frontBaseUrl: frontBaseUrl,
      lastName: data.lastName,
      nomenclature: data.nomenclature,
      rol: data.rol,
    };
    // console.log(body)
    registerUser(body);
    reset({
      cI: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      nomenclature: "",
    });
  };

  return (
    <div>
      {isLoading && <IsLoading />}
      <div className="create__users__list__users">
        <div className="create__user__card">
          <h2 className="title__create__user__card">Cree un nuevo Usuario</h2>
          <form className="create__user__form" onSubmit={handleSubmit(submit)}>
            <label className="label__create__user__card">
              <span className="span__create__user__card">Cedula:</span>
              <input
                className="input__create__user__card"
                {...register("cI")}
                type="text"
                required
              />
            </label>
            <label className="label__create__user__card">
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
                display: userRol === "Administrador" ? "block" : "none",
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
                  className="input__create__user__card"
                  value="Administrador"
                >
                  Administrador
                </option>
              </select>
            </label>
            <button className="create__user__card__btn">Crear</button>
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
          </form>
        </div>
        <section>
          <UsersList />
        </section>
      </div>
    </div>
  );
};

export default CreateUsers;
