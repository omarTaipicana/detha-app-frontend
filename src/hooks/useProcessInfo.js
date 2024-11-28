import { useState } from "react";

const useProcessInfo = () => {
  const [objDesp, setObjDesp] = useState({});

  const today = new Date();
  const processDesp = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const latestPase = item.pases
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      const latestDesplazamientos = item.desplazamientos
        .filter((d) => !d.fechaFinalización && new Date(d.fechaInicio) <= today)
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      const latestAscenso = item.ascensos
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      if (!latestPase) return acc;

      const { direccion, unidad, unidadSubzona, nomenclatura, cargo } =
        latestPase;

      const { grado } = latestAscenso;

      if (!acc[direccion])
        acc[direccion] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
          unidades: {},
        };

      if (latestDesplazamientos?.direccion === "OTROS" && !acc["OTROS"])
        acc["OTROS"] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
          unidades: {},
        };
      if (
        latestDesplazamientos?.direccion === "OTROS" &&
        !acc["OTROS"].unidades["OTROS"]
      )
        acc["OTROS"].unidades["OTROS"] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
          subzonas: {},
        };
      if (
        latestDesplazamientos?.direccion === "OTROS" &&
        !acc["OTROS"].unidades["OTROS"].subzonas["OTROS"]
      )
        acc["OTROS"].unidades["OTROS"].subzonas["OTROS"] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
          nomenclaturas: {},
        };
      if (
        latestDesplazamientos?.direccion === "OTROS" &&
        !acc["OTROS"].unidades["OTROS"].subzonas["OTROS"].nomenclaturas["OTROS"]
      )
        acc["OTROS"].unidades["OTROS"].subzonas["OTROS"].nomenclaturas[
          "OTROS"
        ] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
          cargos: {},
        };
      if (
        latestDesplazamientos?.direccion === "OTROS" &&
        !acc["OTROS"].unidades["OTROS"].subzonas["OTROS"].nomenclaturas["OTROS"]
          .cargos["OTROS"]
      )
        acc["OTROS"].unidades["OTROS"].subzonas["OTROS"].nomenclaturas[
          "OTROS"
        ].cargos["OTROS"] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
        };

      if (latestDesplazamientos?.direccion === "OTROS") {
        if (
          !acc["OTROS"].unidades["OTROS"].subzonas["OTROS"].nomenclaturas[
            "OTROS"
          ].cargos["OTROS"].grados
        ) {
          acc["OTROS"].unidades["OTROS"].subzonas["OTROS"].nomenclaturas[
            "OTROS"
          ].cargos["OTROS"].grados = {};
        }

        if (
          !acc["OTROS"].unidades["OTROS"].subzonas["OTROS"].nomenclaturas[
            "OTROS"
          ].cargos["OTROS"].grados["OTROS"]
        ) {
          acc["OTROS"].unidades["OTROS"].subzonas["OTROS"].nomenclaturas[
            "OTROS"
          ].cargos["OTROS"].grados["OTROS"] = {
            count: 0,
            tipoDesplazamientoCounts: {},
            tipoDesplazamientoIntCounts: {},
          };
        }
      }

      if (latestDesplazamientos && !acc[latestDesplazamientos?.direccion])
        acc[latestDesplazamientos?.direccion] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
          unidades: {},
        };

      if (!acc[direccion].unidades[unidad])
        acc[direccion].unidades[unidad] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
          subzonas: {},
        };

      if (
        acc[latestDesplazamientos?.direccion] &&
        !acc[latestDesplazamientos?.direccion]?.unidades[
          latestDesplazamientos?.unidad
        ]
      )
        acc[latestDesplazamientos?.direccion].unidades[
          latestDesplazamientos?.unidad
        ] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
          subzonas: {},
        };

      if (!acc[direccion].unidades[unidad].subzonas[unidadSubzona])
        acc[direccion].unidades[unidad].subzonas[unidadSubzona] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
          nomenclaturas: {},
        };

      if (
        acc[latestDesplazamientos?.direccion]?.unidades[
          latestDesplazamientos?.unidad
        ] &&
        !acc[latestDesplazamientos?.direccion]?.unidades[
          latestDesplazamientos?.unidad
        ].subzonas[latestDesplazamientos?.unidadSubzona]
      )
        acc[latestDesplazamientos?.direccion].unidades[
          latestDesplazamientos?.unidad
        ].subzonas[latestDesplazamientos?.unidadSubzona] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
          nomenclaturas: {},
        };

      if (
        !acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
          nomenclatura
        ]
      )
        acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
          nomenclatura
        ] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
          cargos: {},
        };

      if (
        acc[latestDesplazamientos?.direccion]?.unidades[
          latestDesplazamientos?.unidad
        ].subzonas[latestDesplazamientos?.unidadSubzona] &&
        !acc[latestDesplazamientos?.direccion]?.unidades[
          latestDesplazamientos?.unidad
        ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
          latestDesplazamientos?.nomenclatura
        ]
      )
        acc[latestDesplazamientos?.direccion].unidades[
          latestDesplazamientos?.unidad
        ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
          latestDesplazamientos?.nomenclatura
        ] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
          cargos: {},
        };

      if (
        !acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
          nomenclatura
        ].cargos[cargo]
      )
        acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
          nomenclatura
        ].cargos[cargo] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
          grados: {},
        };

      if (
        acc[latestDesplazamientos?.direccion]?.unidades[
          latestDesplazamientos?.unidad
        ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
          latestDesplazamientos?.nomenclatura
        ] &&
        !acc[latestDesplazamientos?.direccion]?.unidades[
          latestDesplazamientos?.unidad
        ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
          latestDesplazamientos?.nomenclatura
        ].cargos[latestDesplazamientos?.cargo]
      )
        acc[latestDesplazamientos?.direccion].unidades[
          latestDesplazamientos?.unidad
        ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
          latestDesplazamientos?.nomenclatura
        ].cargos[latestDesplazamientos?.cargo] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
          grados: {},
        };

      if (
        grado &&
        !acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
          nomenclatura
        ].cargos[cargo].grados[grado]
      ) {
        acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
          nomenclatura
        ].cargos[cargo].grados[grado] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
        };
      }

      if (
        grado &&
        acc[latestDesplazamientos?.direccion]?.unidades[
          latestDesplazamientos?.unidad
        ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
          latestDesplazamientos?.nomenclatura
        ].cargos[latestDesplazamientos?.cargo] &&
        !acc[latestDesplazamientos?.direccion]?.unidades[
          latestDesplazamientos?.unidad
        ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
          latestDesplazamientos?.nomenclatura
        ].cargos[latestDesplazamientos?.cargo].grados[grado]
      )
        acc[latestDesplazamientos?.direccion].unidades[
          latestDesplazamientos?.unidad
        ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
          latestDesplazamientos?.nomenclatura
        ].cargos[latestDesplazamientos?.cargo].grados[grado] = {
          count: 0,
          tipoDesplazamientoCounts: {},
          tipoDesplazamientoIntCounts: {},
        };

      acc[direccion].count++;
      acc[direccion].unidades[unidad].count++;
      acc[direccion].unidades[unidad].subzonas[unidadSubzona].count++;
      acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
        nomenclatura
      ].count++;
      acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
        nomenclatura
      ].cargos[cargo].count++;
      acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
        nomenclatura
      ].cargos[cargo].grados[grado].count++;

      if (latestDesplazamientos) {
        const tipo = latestDesplazamientos.tipoDesplazamiento;

        if (latestDesplazamientos.direccion !== direccion) {
          acc[direccion].tipoDesplazamientoCounts[tipo] =
            (acc[direccion].tipoDesplazamientoCounts[tipo] || 0) + 1;

          acc[latestDesplazamientos?.direccion].tipoDesplazamientoIntCounts[
            tipo
          ] =
            (acc[latestDesplazamientos?.direccion].tipoDesplazamientoIntCounts[
              tipo
            ] || 0) + 1;
        }

        if (latestDesplazamientos.unidad !== unidad) {
          acc[direccion].unidades[unidad].tipoDesplazamientoCounts[tipo] =
            (acc[direccion].unidades[unidad].tipoDesplazamientoCounts[tipo] ||
              0) + 1;

          acc[latestDesplazamientos?.direccion].unidades[
            latestDesplazamientos?.unidad
          ].tipoDesplazamientoIntCounts[tipo] =
            (acc[latestDesplazamientos?.direccion].unidades[
              latestDesplazamientos?.unidad
            ].tipoDesplazamientoIntCounts[tipo] || 0) + 1;
        }

        if (latestDesplazamientos.unidadSubzona !== unidadSubzona) {
          acc[direccion].unidades[unidad].subzonas[
            unidadSubzona
          ].tipoDesplazamientoCounts[tipo] =
            (acc[direccion].unidades[unidad].subzonas[unidadSubzona]
              .tipoDesplazamientoCounts[tipo] || 0) + 1;

          acc[latestDesplazamientos?.direccion].unidades[
            latestDesplazamientos?.unidad
          ].subzonas[
            latestDesplazamientos?.unidadSubzona
          ].tipoDesplazamientoIntCounts[tipo] =
            (acc[latestDesplazamientos?.direccion].unidades[
              latestDesplazamientos?.unidad
            ].subzonas[latestDesplazamientos?.unidadSubzona]
              .tipoDesplazamientoIntCounts[tipo] || 0) + 1;
        }

        acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
          nomenclatura
        ].tipoDesplazamientoCounts[tipo] =
          (acc[direccion].unidades[unidad].subzonas[unidadSubzona]
            .nomenclaturas[nomenclatura].tipoDesplazamientoCounts[tipo] || 0) +
          1;

        acc[latestDesplazamientos?.direccion].unidades[
          latestDesplazamientos?.unidad
        ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
          latestDesplazamientos?.nomenclatura
        ].tipoDesplazamientoIntCounts[tipo] =
          (acc[latestDesplazamientos?.direccion].unidades[
            latestDesplazamientos?.unidad
          ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
            latestDesplazamientos?.nomenclatura
          ].tipoDesplazamientoIntCounts[tipo] || 0) + 1;

        acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
          nomenclatura
        ].cargos[cargo].tipoDesplazamientoCounts[tipo] =
          (acc[direccion].unidades[unidad].subzonas[unidadSubzona]
            .nomenclaturas[nomenclatura].cargos[cargo].tipoDesplazamientoCounts[
            tipo
          ] || 0) + 1;

        acc[latestDesplazamientos?.direccion].unidades[
          latestDesplazamientos?.unidad
        ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
          latestDesplazamientos?.nomenclatura
        ].cargos[latestDesplazamientos?.cargo].tipoDesplazamientoIntCounts[
          tipo
        ] =
          (acc[latestDesplazamientos?.direccion].unidades[
            latestDesplazamientos?.unidad
          ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
            latestDesplazamientos?.nomenclatura
          ].cargos[latestDesplazamientos?.cargo].tipoDesplazamientoIntCounts[
            tipo
          ] || 0) + 1;

        acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
          nomenclatura
        ].cargos[cargo].grados[grado].tipoDesplazamientoCounts[tipo] =
          (acc[direccion].unidades[unidad].subzonas[unidadSubzona]
            .nomenclaturas[nomenclatura].cargos[cargo].grados[grado]
            .tipoDesplazamientoCounts[tipo] || 0) + 1;

        acc[latestDesplazamientos?.direccion].unidades[
          latestDesplazamientos?.unidad
        ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
          latestDesplazamientos?.nomenclatura
        ].cargos[latestDesplazamientos?.cargo].grados[
          grado
        ].tipoDesplazamientoIntCounts[tipo] =
          (acc[latestDesplazamientos?.direccion].unidades[
            latestDesplazamientos?.unidad
          ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
            latestDesplazamientos?.nomenclatura
          ].cargos[latestDesplazamientos?.cargo].grados[grado]
            .tipoDesplazamientoIntCounts[tipo] || 0) + 1;
      }

      return acc;
    }, {});

    setObjDesp(groupedData);
  };

  return [processDesp, objDesp];
};

export default useProcessInfo;
