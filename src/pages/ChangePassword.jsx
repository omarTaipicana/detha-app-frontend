import React from "react";
import "./styles/ChangePassword.css";

const ChangePassword = () => {
  return (
    <div className="change__password__card">
      <h2 className="title__change__password__card">Cambie su Contraseña</h2>
      <form className="change__password__form">
        <label className="label__change__password__card">
          <span className="span__change__password__card">Escriba su nueva Contraseña</span>
          <input className="input__change__password__card" type="password" />
        </label>
        <label className="label__change__password__card">
          <span className="span__change__password__card">Valide su Contraseña</span>
          <input className="input__change__password__card" type="password" />
        </label>

        <button className="change__password__card__btn">Enviar</button>
      </form>
    </div>
  );
};

export default ChangePassword;
