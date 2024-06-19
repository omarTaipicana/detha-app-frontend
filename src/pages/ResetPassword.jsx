import React from "react";
import "./styles/ResetPassword.css";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";

const ResetPassword = () => {
  const { register, handleSubmit, reset } = useForm();
  const [registerUser, loginUser, verifyUser, sendEmail] = useAuth();

  const submit = (data) => {
    const frontBaseUrl = `${location.protocol}//${location.host}/#/reset_password`;
    const body = { ...data, frontBaseUrl };
    console.log(body);
    sendEmail(body);
    reset({
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="send__email__card">
      <h2 className="title__send__email__card">Resetea tu Contraseña</h2>
      <form className="send__email__form" onSubmit={handleSubmit(submit)}>
        <label className="label__send__email__card">
          <span className="span__send__email__card">Email</span>
          <input
            className="input__send__email__card"
            {...register("email")}
            type="email"
          />
        </label>
        <button className="send__email__card__btn">Enviar</button>
      </form>
    </div>
  );
};

export default ResetPassword;
