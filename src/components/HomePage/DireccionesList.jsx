import React, { useEffect } from "react";
import useCrud from "../../hooks/useCrud";
import DireccionUnidad from "./DireccionUnidad";

const DireccionesList = () => {
  const PATH = "/organicos";
  const [data, getApi, , , , , isLoading] = useCrud();

  useEffect(() => {
    getApi(PATH);
  }, []);

  const dataFilter = Array.from(
    new Set(
      data.map((item) =>
        JSON.stringify({
          unidad: item.unidad,
          siglasDireccion: item.siglasDireccion,
        })
      )
    )
  )
    .map((item) => JSON.parse(item))
    .filter((item) => item.unidad !== "OTROS")
    .reverse(); 

    
  return (
    <div className="direcciones__list__content">
      <section>
        <h3 className="direcciones__list__title">DIRECCIONES - UNIDADES</h3>
        <article className="direcciones__list">
          {" "}
          {dataFilter.map((direccion) => (
            <DireccionUnidad key={direccion.unidad} direccion={direccion} />
          ))}
        </article>
      </section>
    </div>
  );
};

export default DireccionesList;
