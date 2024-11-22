import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import DireccionUnidad from "./DireccionUnidad";
import DireccionUnidadInfo from "./DireccionUnidadInfo";
import IsLoading from "../shared/IsLoading";

const DireccionesList = () => {
  const PATH_ORGANICOS = "/organicos";
  const PATH__SERVIDORES = "/servidores";
  const [show, setShow] = useState(false);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [org, setOrg] = useState([]);
  const [serv, setServ] = useState([]);
  const [desp, setDesp] = useState([]);
  const [legalizado, setLegalizado] = useState([]);
  const [aprobado, setAprobado] = useState([]);

  const [organico, getOrganico, , , , ,] = useCrud();
  const [servidores, getServidores, , , , , isLoading] = useCrud();

  useEffect(() => {
    getOrganico(PATH_ORGANICOS);
    getServidores(PATH__SERVIDORES);
  }, []);

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
      .filter((item) => item.unidad !== "OTROS")
      .sort((a, b) => {
        if (a.unidad === "PLANTA CENTRAL") return -1;
        if (b.unidad === "PLANTA CENTRAL") return 1;
        if (a.unidad === "DNPJ") return -2;
        if (b.unidad === "DNPJ") return 2;
        if (a.unidad === "DNA") return -3;
        if (b.unidad === "DNA") return 3;
        if (a.unidad === "DINASED") return -4;
        if (b.unidad === "DINASED") return 4;
        return -1;
      }),
  ];

  useEffect(() => {
    if ((!isLoading && show) || (!isLoading && !loadingCompleted)) {
      setShow(false);
      setLoadingCompleted(true);
    }
  }, [isLoading]);

  const handleClick = () => {
    if (isLoading) {
      setShow(true);
      setLoadingCompleted(false);
    }

    if (!isLoading && loadingCompleted) {
      setShow(true);
    }
  };
  return (
    <div className="direcciones__list__content">
      <section>
        <h3 className="direcciones__list__title">
          DIRECCIONES NACIONALES Y UNIDADES TRANSVERSALES
        </h3>
        <article className="direcciones__list">
          {dataFilter.map((direccion, index) => (
            <DireccionUnidad
              key={direccion.unidad}
              direccion={direccion}
              delay={index * 0.2}
              isLoading={isLoading}
              setOrg={setOrg}
              setServ={setServ}
              setDesp={setDesp}
              show={show}
              setShow={setShow}
              handleClick={handleClick}
              setLegalizado={setLegalizado}
              setAprobado={setAprobado}
              organico={organico.filter((o) => o.unidad === direccion.unidad)}
              servidores={servidores.filter((s) => {
                const ultimoPase = s.pases.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )[0];
                if (ultimoPase) {
                  if (direccion.unidad === "PLANTA CENTRAL") {
                    return ultimoPase.unidad === "Planta Administrativa DIGIN";
                  } else if (ultimoPase.direccion === "DIGIN") {
                    return ultimoPase.unidad === direccion.unidad;
                  } else {
                    return ultimoPase.direccion === direccion.siglasDireccion;
                  }
                }
                return false;
              })}
              desplazamientos={servidores.filter((s) => {
                const ultimoDesplazamiento = s?.desplazamientos.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )[0];
                if (ultimoDesplazamiento) {
                  if (direccion.unidad === "PLANTA CENTRAL") {
                    return (
                      ultimoDesplazamiento.unidad ===
                      "Planta Administrativa DIGIN"
                    );
                  } else if (ultimoDesplazamiento.direccion === "DIGIN") {
                    return ultimoDesplazamiento.unidad === direccion.unidad;
                  } else {
                    return (
                      ultimoDesplazamiento.direccion ===
                      direccion.siglasDireccion
                    );
                  }
                }
                return false;
              })}
            />
          ))}
        </article>
      </section>
      {show && isLoading && <IsLoading />}
      {show && loadingCompleted && (
        <DireccionUnidadInfo
          setShow={setShow}
          serv={serv}
          org={org}
          desp={desp}
          legalizado={legalizado}
          aprobado={aprobado}
        />
      )}
    </div>
  );
};

export default DireccionesList;
