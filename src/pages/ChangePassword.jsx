import React from "react";
import "./styles/ChangePassword.css";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router-dom";

const ChangePassword = () => {
  const { code: code } = useParams();
  const { register, handleSubmit, reset } = useForm();
  const [registerUser, loginUser, verifyUser] = useAuth();

  const submit = (data) => {
    if (data.password === data.confirmPassword) {
      const body = {
        password: data.password,
      };
      verifyUser(body, code);
    } else {
      console.log("no igual");
    }

    reset({
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="change__password__card">
      <h2 className="title__change__password__card">Cambie su Contraseña</h2>
      <form className="change__password__form" onSubmit={handleSubmit(submit)}>
        <label className="label__change__password__card">
          <span className="span__change__password__card">
            Escriba su nueva Contraseña
          </span>
          <input
            className="input__change__password__card"
            type="password"
            {...register("password")}
          />
        </label>
        <label className="label__change__password__card">
          <span className="span__change__password__card">
            Valide su Contraseña
          </span>
          <input
            className="input__change__password__card"
            type="password"
            {...register("confirmPassword")}
          />
        </label>

        <button className="change__password__card__btn">Enviar</button>
      </form>
    </div>
  );
};

export default ChangePassword;
