import React from "react";
import { Link } from "react-router-dom";
import "./styles/Login.css";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import IsLoading from "../components/shared/IsLoading";

const HomePage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [, loginUser, , , err, isLoading] = useAuth();

  const submit = (data) => {
    loginUser(data);
    reset({
      cI: "",
      password: "",
    });
  };
  // console.log(err?.response.data.mesagge);
  // console.log(isLoading);
  return (
    <div>
      {isLoading && <IsLoading />}
      <div className="login__card">
        <h2 className="title__login__card">SECCIÓN DE TALENTO HUMANO</h2>
        <form className="login__form" onSubmit={handleSubmit(submit)}>
          <label className="label__login__card">
            <span className="span__login__card">Usuario</span>
            <input
              className="input__login__card"
              {...register("cI")}
              type="text"
            />
          </label>
          <label className="label__login__card">
            <span className="span__login__card">Contraseña</span>
            <input
              className="input__login__card"
              {...register("password")}
              type="password"
            />
          </label>

          <Link to="/reset_password">Olvido su contraseña</Link>
          <button className="login__card__btn">Ingresar</button>
          <span className="text__err">{err?.response.data.mesagge}</span>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
