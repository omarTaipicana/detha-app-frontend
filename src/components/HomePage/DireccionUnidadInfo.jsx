import React from "react";
import "./style/DireccionUnidadInfo.css";
import ResumenThDirecciones from "./ResumenThDirecciones";

const DireccionUnidadInfo = ({
  setShow,
  serv,
  org,
  desp,
  legalizado,
  aprobado,
}) => {
  return (
    <div
      className={`direccion__unidad__content fondo__${
        org[0].unidadNombre === "Planta Administrativa"
          ? org[0].siglasDireccion
          : org[0].siglaUnidad
      }`}
    >
      <div className="direccion__unidad__title__content">
        <div onClick={() => setShow(false)} className="cerrar__content">
          ❌
        </div>
        <span className="direccion__unidad__title">
          {` ${
            org[0].unidadNombre === "Planta Administrativa"
              ? org[0].direccion
              : org[0].unidadNombre
          } `}{" "}
          <span> - </span>{" "}
          {`" ${
            org[0].unidadNombre === "Planta Administrativa"
              ? org[0].siglasDireccion
              : org[0].siglaUnidad
          } "`}
        </span>
      </div>
      <section className="direccion__unidad__resumen__content">
        <ul className="direccion__unidad__ul__resumen">
          <li className="direccion__unidad__li__resumen__logo">
            <img
              className="img__logo"
              src={`../../../logos/${
                org[0].unidadNombre === "Planta Administrativa"
                  ? org[0].siglasDireccion
                  : org[0].siglaUnidad
              }.png`}
              alt=""
            />
          </li>
          <li className="direccion__unidad__li__resumen__deficit">
            <span className="direccion__unidad__resumen__title">
              DÉFICIT / EXCESO DE TALENTO HUMANO
            </span>
            <article className="direccion__unidad__content__deficit">
              <ul className="direccion__unidad__resumen__ul__deficit">
                <li className="direccion__unidad__resumen__li__deficit">
                  <span className="direccion__unidad__resumen__deficit__span__label">
                    LEGALIZADOS
                  </span>
                  <span className="direccion__unidad__deficit__span__img">
                    <img
                      className="direccion__unidad__img__flecha"
                      src="../../../flecha-derecha.png"
                      alt=""
                    />
                  </span>
                  <span className="direccion__unidad__resumen__deficit__span__value">
                    {legalizado.totalGeneral}
                  </span>
                </li>
                <li className="direccion__unidad__resumen__li__deficit">
                  <span className="direccion__unidad__resumen__deficit__span__label">
                    APROBADO 2024
                  </span>
                  <span className="direccion__unidad__deficit__span__img">
                    <img
                      className="direccion__unidad__img__flecha"
                      src="../../../flecha-derecha.png"
                      alt=""
                    />
                  </span>
                  <span className="direccion__unidad__resumen__deficit__span__value">
                    {aprobado.totalGeneral}
                  </span>
                </li>
                <li className="direccion__unidad__resumen__li__deficit">
                  <span className="direccion__unidad__resumen__deficit__span__label">
                    DÉFICIT / EXCESO
                  </span>
                  <span className="direccion__unidad__deficit__span__img">
                    <img
                      className="direccion__unidad__img__flecha"
                      src="../../../flecha-derecha.png"
                      alt=""
                    />
                  </span>
                  <span
                    className="direccion__unidad__resumen__deficit__span__value"
                    style={{
                      color:
                        legalizado.totalGeneral - aprobado.totalGeneral > 0
                          ? "green"
                          : "red",
                    }}
                  >
                    {legalizado.totalGeneral - aprobado.totalGeneral}
                  </span>
                </li>
              </ul>
              <section className="direccion__unidad__btn__vermas">
                <button className="ver-mas-button">Ver más</button>
              </section>
            </article>
          </li>
        </ul>

        <ul className="direccion__unidad__ul__resumen">
          <li className="direccion__unidad__li__resumen">
            <span className="direccion__unidad__resumen__title">
              DESPLAZAMIENTO DEL TALENTO HUMANO
            </span>
          </li>
          <li className="direccion__unidad__li__resumen">
            <span className="direccion__unidad__resumen__title">
              NOVEDADES CON EL TALENTO HUMANO
            </span>
          </li>
        </ul>
      </section>
      <section>
        <article className="direccion__unidad__table__content">
          <div>
            {/* <ResumenThDirecciones serv={serv} org={org} desp={desp} /> */}
          </div>
        </article>
      </section>
    </div>
  );
};

export default DireccionUnidadInfo;
