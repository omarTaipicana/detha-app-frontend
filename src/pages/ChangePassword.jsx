import React, { useEffect, useState } from "react";
import "./styles/ChangePassword.css";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import IsLoading from "../components/HomePage/IsLoading";

const ChangePassword = () => {
  const { code: code } = useParams();
  const { register, handleSubmit, reset } = useForm();
  const [, , verifyUser, , err, isLoading] = useAuth();
  const [message, setMessage] = useState("");

  const submit = (data) => {
    if (data.password === data.confirmPassword) {
      const body = {
        password: data.password,
      };
      verifyUser(body, code);
      setMessage(err?.response.data.mesagge);
    } else {
      setMessage("Las contraseñas no coinciden");
    }
    reset({
      password: "",
      confirmPassword: "",
    });
  };

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, [code]);

  return (
    <div>
      {isLoading && <IsLoading />}
      <div className="change__password__card">
        <h2 className="title__change__password__card">Cambie su Contraseña</h2>
        <form
          className="change__password__form"
          onSubmit={handleSubmit(submit)}
        >
          <label className="label__change__password__card">
            <span className="span__change__password__card">
              Escriba su nueva Contraseña
            </span>
            <input
              className="input__change__password__card"
              type="password"
              required
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$"
              title="La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número, un símbolo y tener al menos 8 caracteres."
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
              required
              {...register("confirmPassword")}
            />
          </label>

          <button className="change__password__card__btn">Enviar</button>
          <span className="text__err">
            {message ? message : err?.response.data.mesagge}
          </span>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
