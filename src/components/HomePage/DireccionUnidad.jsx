import React from "react";
import "./style/DireccionUnidad.css";

const DireccionUnidad = ({ direccion }) => {
  return (
    <div className="direccion__content">
      <section >
        {direccion.unidad}
        <img
          className="imag__logo"
          src={`../../../logos/${direccion.unidad}.png`}
          onClick={() => setHide(false)}
        />
      </section>
    </div>
  );
};

export default DireccionUnidad;
3