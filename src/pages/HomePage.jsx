import React from "react";
import { Link } from "react-router-dom";
import "./styles/HomePage.css";

const HomePage = () => {
  return (
    <div className="login__card">
      <h2 className="title__login__card">Sección de Talento Humano</h2>
      <form className="login__form">
        <label className="label__login__card">
          <span className="span__login__card">Usuario</span>
          <input className="input__login__card" type="text" />
        </label>
        <label className="label__login__card">
          <span className="span__login__card">Contraseña</span>
          <input className="input__login__card" type="password" />
        </label>

        <Link to="/reset_password">
          Olvido su contraseña
        </Link>
        <button className="login__card__btn">Ingresar</button>
      </form>
    </div>
  );
};

export default HomePage;
