import React from "react";
import "./styles/CardUsers.css";

const CardUser = ({ user }) => {
  return (
    <div className="card__user">
      <ul className="card__ul">
        <li className="card__li">
          <span className="card__label">Cedula: </span>
          <span className="card__value">{user.cI}</span>
        </li>
        <li className="card__li">
          <span className="card__label">Nombres: </span>
          <span className="card__value">{user.firstName}</span>
        </li>
        <li className="card__li">
          <span className="card__label">Apellidios: </span>
          <span className="card__value">{user.lastName}</span>
        </li>
        <li className="card__li">
          <span className="card__label">Correo electrónico: </span>
          <span className="card__value">{user.email}</span>
        </li>
        <li className="card__li">
          <span className="card__label">Nomenclatura: </span>
          <span className="card__value">{user.nomenclature}</span>
        </li>
        <li className="card__li">
          <span className="card__label">Rol de usuario: </span>
          <span className="card__value">{user.rol}</span>
        </li>
        <li className="card__li">
          <span className="card__label">Hbilitado: </span>
          <span className="card__value">
            {user.enabled ? "Habilitado" : "Deshabilitado"}
          </span>
        </li>
        <button>Edit</button>
      </ul>
    </div>
  );
};

export default CardUser;
