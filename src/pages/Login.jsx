import React from "react";
import { Link } from "react-router-dom";
import "./styles/Login.css";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";

const HomePage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [registerUser, loginUser] = useAuth();

  const submit = (data) => {
    console.log(data);
    loginUser(data);
    reset({
      cI: "",
      password: "",
    });
  };

  return (
    <div className="login__card">
      <h2 className="title__login__card">Sección de Talento Humano</h2>
      <form className="login__form" onSubmit={handleSubmit(submit)}>
        <label className="label__login__card">
          <span className="span__login__card">Usuario</span>
          <input className="input__login__card"  {...register("cI")} type="text" />
        </label>
        <label className="label__login__card">
          <span className="span__login__card">Contraseña</span>
          <input className="input__login__card"  {...register("password")} type="password" />
        </label>

        <Link to="/reset_password">Olvido su contraseña</Link>
        <button className="login__card__btn">Ingresar</button>
      </form>
    </div>
  );
};

export default HomePage;
