import React from "react";
import "./styles/ResetPassword.css";

const ResetPassword = () => {
  return (
    <div className="send__email__card">
      <h2 className="title__send__email__card">Resetea tu Contraseña</h2>
      <form className="send__email__form">
        <label className="label__send__email__card">
          <span className="span__send__email__card">Email</span>
          <input className="input__send__email__card" type="email" />
        </label>
        <button className="send__email__card__btn">Enviar</button>
      </form>
    </div>
  );
};

export default ResetPassword;
