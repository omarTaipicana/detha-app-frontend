import React from "react";
import "./styles/ResetPassword.css";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import IsLoading from "../components/HomePage/IsLoading";

const ResetPassword = () => {
  const { register, handleSubmit, reset } = useForm();
  const [, , , sendEmail, err, isLoading] = useAuth();

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
    <div>
      {isLoading && <IsLoading />}
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
          <span className="text__err">{err?.response.data.mesagge}</span>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
