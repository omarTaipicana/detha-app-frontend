import React, { useEffect } from "react";
import { useParams } from "react-router";
import useCrud from "../../hooks/useCrud";

export const Prueba = () => {
  const PATH_ORGANICOS = "/organicos";
  const PATH__SERVIDORES = "/servidores";
  const { code: code } = useParams();
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
      .filter((item) => item.unidad !== "OTROS"),
  ];

  const direccion = dataFilter.filter((s) => s.unidad === code.toUpperCase())[0];

  const servidoresFilter = servidores.filter((s) => {
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
  });

  console.log(servidoresFilter)


  return <div>{code}</div>;
};
