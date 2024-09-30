import React from "react";
import "./style/CardServidoresPoliciales.css";

const CardServidoresPoliciales = ({
  servidorPolicial,
  setHide,
  setServidor,
  setServidorEdit,
  setFormIsClouse,
}) => {
  const handleInfoServidorPolicial = () => {
    setServidor(servidorPolicial);
    setHide(false);
  };

  const handleEditServidorPolicial = () => {
    setFormIsClouse(false);
    setServidorEdit(servidorPolicial);
  };

  return (
    <div className="card__servidorPolicial">
      <ul className="card__servidorPolicial__ul">
        <li className="card__servidorPolicial__li__img">
          <img
            className="btn__expand"
            onClick={handleInfoServidorPolicial}
            src="../../../expand.png"
            alt=""
          />
          <img
            className="btn__expand"
            onClick={handleEditServidorPolicial}
            src="../../../edit.png"
            alt=""
          />
        </li>
        <li className="card__servidorPolicial__li">
          <span className="card__servidorPolicial__label">UNIDAD: </span>
          <span
            style={{
              color: servidorPolicial.pases.length === 0 ? "red" : "inherit",
              fontWeight:
                servidorPolicial.pases.length === 0 ? "800" : "inherit",
            }}
          >
            {servidorPolicial.pases.length === 0
              ? "SIN REGISTRO"
              : `${
                  servidorPolicial.pases.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  )[0]?.unidadSubzona || ""
                } / ${
                  servidorPolicial.pases.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  )[0]?.unidad || ""
                }`}
          </span>
        </li>
        <li className="card__servidorPolicial__li">
          <span className="card__servidorPolicial__label">Cedula: </span>
          <span className="card__servidorPolicial__value">
            {servidorPolicial.cI}
          </span>
        </li>
        <li className="card__servidorPolicial__li">
          <span className="card__servidorPolicial__label">Nombres: </span>
          <span className="card__servidorPolicial__value">
            {servidorPolicial.nombres}
          </span>
        </li>
        <li className="card__servidorPolicial__li">
          <span className="card__servidorPolicial__label">Apellidios: </span>
          <span className="card__servidorPolicial__value">
            {servidorPolicial.apellidos}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default CardServidoresPoliciales;
