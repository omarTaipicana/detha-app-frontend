import React from "react";
import "./style/CardServidoresPoliciales.css";

const CardServidoresPoliciales = ({ servidorPolicial }) => {
  const handleEditservidorPolicial = () => {};
  return (
    <div className="card__servidorPolicial">
      <ul className="card__servidorPolicial__ul">
        <li className="card__servidorPolicial__li__img">
          <img className="btn__expand"
            onClick={handleEditservidorPolicial}
            src="../../../expand.png"
            alt=""
          />
        </li>
        <li className="card__servidorPolicial__li">
          <span className="card__servidorPolicial__label">Id: </span>
          <span className="card__servidorPolicial__value">{servidorPolicial.id}</span>
        </li>
        <li className="card__servidorPolicial__li">
          <span className="card__servidorPolicial__label">Cedula: </span>
          <span className="card__servidorPolicial__value">{servidorPolicial.cI}</span>
        </li>
        <li className="card__servidorPolicial__li">
          <span className="card__servidorPolicial__label">Nombres: </span>
          <span className="card__servidorPolicial__value">{servidorPolicial.nombres}</span>
        </li>
        <li className="card__servidorPolicial__li">
          <span className="card__servidorPolicial__label">Apellidios: </span>
          <span className="card__servidorPolicial__value">{servidorPolicial.apellidos}</span>
        </li>


      </ul>
    </div>
  );
};

export default CardServidoresPoliciales;
