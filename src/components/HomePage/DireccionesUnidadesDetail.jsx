import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useCrud from "../../hooks/useCrud";
import "./style/DireccionUnidadInfo.css";
import IsLoading from "../shared/IsLoading";
import { useNavigate } from "react-router-dom";
import ResumenThDirecciones from "./ResumenThDirecciones";
import ResumenTh from "./ResumenTh";
import useProcessInfo from "../../hooks/useProcessInfo";

const DireccionesUnidadesDetail = () => {
  const navigate = useNavigate();
  const PATH_ORGANICOS = "/organicos";
  const PATH__SERVIDORES = "/servidores";
  const { code: code } = useParams();
  const [organico, getOrganico, , , , ,] = useCrud();
  const [servidores, getServidores, , , , , isLoading] = useCrud();
  const [processDesp, objDesp] = useProcessInfo();

  const [showTableComp, setShowTableComp] = useState(false);
  const [showTableDesp, setShowTableDesp] = useState(false);
  const [showtableNov, setShowtableNov] = useState(false);


  // --------------------------------------------------------------------
  // TRAER
  useEffect(() => {
    getOrganico(PATH_ORGANICOS);
    getServidores(PATH__SERVIDORES);
  }, []);
  // --------------------------------------------------------------------
  // OBTENER DIRECCION SEGUN CODE
  const dataFilter = [
    ...Array.from(
      new Set(
        organico.map((item) =>
          JSON.stringify({
            unidad: item.unidad,
            siglasDireccion: item.siglasDireccion,
          })
        )
      )
    )
      .map((item) => JSON.parse(item))
      .filter((item) => item.unidad !== "OTROS"),
  ];

  const direccion = dataFilter.filter(
    (s) => s.unidad === code?.toUpperCase()
  )[0];

  // --------------------------------------------------------------------
  // OBTENER ORG, SERV, Y DESP FILTRADO

  const getFilteredData = (data, field) =>
    data.filter((item) => {
      const lastEntry = item[field]?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];

      if (lastEntry) {
        if (direccion?.unidad === "PLANTA CENTRAL") {
          return lastEntry.unidad === "Planta Administrativa DIGIN";
        } else if (lastEntry.direccion === "DIGIN") {
          return lastEntry.unidad === direccion?.unidad;
        } else {
          return lastEntry.direccion === direccion?.siglasDireccion;
        }
      }
      return false;
    });

  const org = organico.filter((o) => o?.unidad === direccion?.unidad);
  const serv = getFilteredData(servidores, "pases");
  const desp = getFilteredData(servidores, "desplazamientos");

  // --------------------------------------------------------------------
  // OBTENER DESPLAZAMIENTOS PROCESADOS

  const seenIds = new Set();
  const data = [...serv, ...desp].filter((item) => {
    if (!item.id) return false;
    if (seenIds.has(item.id)) return false;
    seenIds.add(item.id);
    return true;
  });

  useEffect(() => {
    if (servidores && Object.keys(servidores).length > 0) {
      processDesp(data);
    }
  }, [servidores, code]);
  

  // --------------------------------------------------------------------
  // FILTRAR SEGUN CODE

  const getFilteredObject = (objDesp, direccion) => {
    if (direccion?.unidad === "PLANTA CENTRAL") {
      return objDesp?.DIGIN?.unidades["Planta Administrativa DIGIN"];
    } else if (direccion?.siglasDireccion === "DIGIN") {
      return objDesp?.DIGIN?.unidades[direccion?.unidad];
    } else {
      return objDesp[direccion?.siglasDireccion];
    }
  };

  const objFilter = getFilteredObject(objDesp, direccion);

  // --------------------------------------------------------------------
  // RPOCESAR OBJETO PARA MOSTRAR NOVEDADES

  // --------------------------------------------------------------------
  // RPOCESAR OBJETO PARA MOSTRAR DESPLAZAMIENTOS

  const transformObject = (selectedObject) => {
    const transformed = {};

    if (selectedObject) {
      if (selectedObject.tipoDesplazamientoCounts) {
        for (const [key, value] of Object.entries(
          selectedObject.tipoDesplazamientoCounts
        )) {
          if (!transformed[key]) {
            transformed[key] = {};
          }
          transformed[key].tipoDesplazamientoCounts = value;
        }
      }

      if (selectedObject.tipoDesplazamientoIntCounts) {
        for (const [key, value] of Object.entries(
          selectedObject.tipoDesplazamientoIntCounts
        )) {
          if (!transformed[key]) {
            transformed[key] = {};
          }
          transformed[key].tipoDesplazamientoIntCounts = value;
        }
      }

      transformed.TOTALES = {
        legalizados: selectedObject.count,
        laborando:
          selectedObject.count -
          Object.values(selectedObject.tipoDesplazamientoCounts).reduce(
            (acc, value) => acc + value,
            0
          ) +
          Object.values(selectedObject.tipoDesplazamientoIntCounts).reduce(
            (acc, value) => acc + value,
            0
          ),
      };
      transformed.SUMA = {
        tipoDesplazamientoCounts: Object.values(
          selectedObject.tipoDesplazamientoCounts
        ).reduce((acc, value) => acc + value, 0),
        tipoDesplazamientoIntCounts: Object.values(
          selectedObject.tipoDesplazamientoIntCounts
        ).reduce((acc, value) => acc + value, 0),
      };
    }

    return transformed;
  };

  const resultDesp = transformObject(objFilter);

  // --------------------------------------------------------------------
  // LEGALIZADO Y APROBADO

  const legalizado = serv.reduce(
    (acc, item) => {
      const ultimoAscenso = item.ascensos.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];

      if (ultimoAscenso) {
        const { grado } = ultimoAscenso;
        acc.grados[grado] = (acc.grados[grado] || 0) + 1;
        acc.totalGeneral += 1;
        const directivosGrados = [
          "GRAS",
          "GRAD",
          "GRAI",
          "CRNL",
          "TCNL",
          "MAYR",
          "CPTN",
          "TNTE",
          "SBTE",
        ];
        const grupo = directivosGrados.includes(grado)
          ? "Directivo"
          : "Técnico Operativo";
        acc.grupos[grupo] = (acc.grupos[grupo] || 0) + 1;
      }
      return acc;
    },
    { grados: {}, grupos: {}, totalGeneral: 0 }
  );

  const aprobado = org.reduce(
    (acc, item) => {
      if (acc.grupos[item.grupoOcupacional]) {
        acc.grupos[item.grupoOcupacional] += item.total;
      } else {
        acc.grupos[item.grupoOcupacional] = item.total;
      }
      acc.totalGeneral += item.total;

      if (acc.grados[item.grado]) {
        acc.grados[item.grado] += item.total;
      } else {
        acc.grados[item.grado] = item.total;
      }

      return acc;
    },
    { grados: {}, grupos: {}, totalGeneral: 0 }
  );

  // --------------------------------------------------------------------
  // CLASE PARA FONDO

  const fondoClase =
    org[0]?.unidadNombre === "Planta Administrativa"
      ? org[0]?.siglasDireccion
      : org[0]?.siglaUnidad;

  // --------------------------------------------------------------------

  return (
    <div>
      {isLoading && <IsLoading />}
      <div className={`direccion__unidad__content fondo__${fondoClase} `}>
        <div className="direccion__unidad__title__content">
          <div onClick={() => navigate("/")} className="cerrar__content">
            ❌
          </div>
          <span className="direccion__unidad__title">
            {serv.length
              ? `${
                  org[0]?.unidadNombre === "Planta Administrativa"
                    ? org[0]?.direccion
                    : org[0]?.unidadNombre
                } - "${
                  org[0]?.unidadNombre === "Planta Administrativa"
                    ? org[0]?.siglasDireccion
                    : org[0]?.siglaUnidad
                }"`
              : "Dirección - Siglas"}
          </span>
        </div>
        <section className="direccion__unidad__resumen__content">
          <ul className="direccion__unidad__ul__resumen_1">
            <li className="direccion__unidad__li__resumen__logo">
              <img
                className="img__logo"
                src={`../../../logos/${
                  org[0]?.unidadNombre === "Planta Administrativa"
                    ? org[0]?.siglasDireccion
                    : org[0]?.siglaUnidad
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
                  <button className="ver__mas__button">Ver más</button>
                </section>
              </article>
            </li>
          </ul>

          <ul className="direccion__unidad__ul__resumen_2">
            <li className="direccion__unidad__li__resumen">
              <span className="direccion__unidad__resumen__title">
                DESPLAZAMIENTO DEL TALENTO HUMANO
              </span>
              <article>
                <ul className="direccion__unidad__ul__resumen__desp">
                  <li className="direccion__unidad__li__resumen__desp">
                    <span className="direccion__unidad__span__resumen__desp"></span>
                    <span className="direccion__unidad__span__resumen__desp fila__columna__desp">
                      FUERA DE LA UNIDAD
                    </span>
                    <span className="direccion__unidad__span__resumen__desp fila__columna__desp">
                      DENTRO A LA UNIDAD
                    </span>
                  </li>
                  {Object.entries(resultDesp).map(([key, value]) => {
                    if (key === "TOTALES" || key === "SUMA") return null;

                    return (
                      <li
                        key={key}
                        className="direccion__unidad__li__resumen__desp"
                      >
                        <span className="direccion__unidad__span__resumen__desp fila__columna__desp">
                          {key}
                        </span>
                        <span className="direccion__unidad__span__resumen__desp value__desp">
                          {value.tipoDesplazamientoCounts || 0}
                        </span>
                        <span className="direccion__unidad__span__resumen__desp value__desp">
                          {value.tipoDesplazamientoIntCounts || 0}
                        </span>
                      </li>
                    );
                  })}
                  <li className="direccion__unidad__li__resumen__desp">
                    <span className="direccion__unidad__span__resumen__desp fila__columna__desp fila__columna__desp_total">
                      TOTAL
                    </span>
                    <span className="direccion__unidad__span__resumen__desp value__desp value__desp_total">
                      {resultDesp?.SUMA?.tipoDesplazamientoCounts || 0}
                    </span>
                    <span className="direccion__unidad__span__resumen__desp value__desp value__desp_total">
                      {resultDesp?.SUMA?.tipoDesplazamientoIntCounts || 0}
                    </span>
                  </li>
                </ul>
                <div className="direccion__unidad__laborando__content">
                  <span className="direccion__unidad__laborando__span__label">
                    PERSONAL EFECTIVO Y DISPONIBLE
                  </span>
                  <img
                    className="direccion__unidad__img__flecha"
                    src="../../../flecha-derecha.png"
                    alt=""
                  />
                  <span className="direccion__unidad__laborando__span__value">
                    {resultDesp?.TOTALES?.laborando}
                  </span>
                </div>
                <section className="direccion__unidad__btn__vermas">
                  <button
                    onClick={() => setShowTableDesp(true)}
                    className="ver__mas__button"
                  >
                    Ver más
                  </button>
                </section>
              </article>
            </li>
            <li className="direccion__unidad__li__resumen">
              <span className="direccion__unidad__resumen__title">
                NOVEDADES CON EL TALENTO HUMANO
              </span>
              <article>
                <ul className="direccion__unidad__ul__resumen__desp">
                  <li className="direccion__unidad__li__resumen__desp">
                    <span className="direccion__unidad__span__resumen__desp"></span>
                    <span className="direccion__unidad__span__resumen__desp fila__columna__desp">
                      LEGALIZADOS
                    </span>
                    <span className="direccion__unidad__span__resumen__desp fila__columna__desp">
                      EN LA UNIDAD
                    </span>
                  </li>
                </ul>
              </article>
            </li>
          </ul>
        </section>
        <section>
          <article className="direccion__unidad__table__content">
            <div>
              <ResumenThDirecciones
                serv={serv}
                org={org}
                desp={desp}
                fondoClase={fondoClase}
                setShowTableDesp={setShowTableDesp}
                showTableDesp={showTableDesp}
              />
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default DireccionesUnidadesDetail;
