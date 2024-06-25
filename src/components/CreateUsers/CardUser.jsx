import React from "react";
import "./styles/CardUsers.css";

const CardUser = ({ user, setUserEdit, setFormIsClouse }) => {
  const handleEdituser = () => {
    setUserEdit(user);
    setFormIsClouse(false);
  };

  return (
    <div className="card__user">
      <ul className="card__ul">
        <li className="card__li__img">
          <img onClick={handleEdituser} src="../../../edit.png" alt="" />
        </li>
        <li className="card__li corto">
          <span className="card__label">Cedula: </span>
          <span className="card__value">{user.cI}</span>
        </li>
        <li className="card__li corto">
          <span className="card__label">Nombres: </span>
          <span className="card__value">{user.firstName}</span>
        </li>
        <li className="card__li corto">
          <span className="card__label">Apellidios: </span>
          <span className="card__value">{user.lastName}</span>
        </li>
        <li className="card__li largo">
          <span className="card__label">Correo electrónico: </span>
          <span className="card__value">{user.email}</span>
        </li>
        <li className="card__li largo">
          <span className="card__label">Nomenclatura: </span>
          <span className="card__value">{user.nomenclature}</span>
        </li>
        <li className="card__li corto">
          <span className="card__label">Rol de usuario: </span>
          <span
            className="card__value"
            style={{
              color:
                user.rol === "Administrador"
                  ? "blue"
                  : user.rol === "Sub-Administrador"
                  ? "red"
                  : "green",
            }}
          >
            {user.rol}
          </span>
        </li>
        <li className="card__li corto">
          <span className="card__label">Sistema: </span>
          <span
            className="card__value"
            style={{ color: user.enabled ? "green" : "red" }}
          >
            {user.enabled ? "Habilitado" : "Deshabilitado"}
          </span>
        </li>
        <li className="card__li">
          <span className="card__label">V. </span>
          <span
            className="card__value__v"
            style={{ backgroundColor: user.isVerified ? "green" : "red" }}
          ></span>
        </li>
      </ul>
    </div>
  );
};

export default CardUser;
