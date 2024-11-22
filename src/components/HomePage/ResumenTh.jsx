import React, { useEffect, useState } from "react";
import "./style/ResumenTh.css";
import IsLoading from "../shared/IsLoading";
import useCrud from "../../hooks/useCrud";

const ResumenTh = () => {
  const PATH = "/servidores";
  const [data, getApi, , , , , isLoading] = useCrud();

  useEffect(() => {
    getApi(PATH);
  }, []);

  const [expandedDireccion, setExpandedDireccion] = useState({});
  const [expandedUnidad, setExpandedUnidad] = useState({});
  const [expandedUnidadSubzona, setExpandedUnidadSubzona] = useState({});
  const [expandedNomenclatura, setExpandedNomenclatura] = useState({});
  const [expandedCargo, setExpandedCargo] = useState({});

  const toggleExpandDireccion = (direccion) => {
    setExpandedDireccion((prev) => {
      const newExpanded = { ...prev, [direccion]: !prev[direccion] };
      if (!newExpanded[direccion]) {
        setExpandedUnidad({});
        setExpandedUnidadSubzona({});
        setExpandedNomenclatura({});
        setExpandedCargo({});
      }
      return newExpanded;
    });
  };

  const toggleExpandUnidad = (direccion, unidad) => {
    setExpandedUnidad((prev) => {
      const key = `${direccion}-${unidad}`;
      const newExpanded = { ...prev, [key]: !prev[key] };
      if (!newExpanded[key]) {
        setExpandedUnidadSubzona({});
        setExpandedNomenclatura({});
        setExpandedCargo({});
      }
      return newExpanded;
    });
  };

  const toggleExpandUnidadSubzona = (direccion, unidad, unidadSubzona) => {
    setExpandedUnidadSubzona((prev) => {
      const key = `${direccion}-${unidad}-${unidadSubzona}`;
      const newExpanded = { ...prev, [key]: !prev[key] };
      if (!newExpanded[key]) {
        setExpandedNomenclatura({});
        setExpandedCargo({});
      }
      return newExpanded;
    });
  };

  const toggleExpandNomenclatura = (
    direccion,
    unidad,
    unidadSubzona,
    nomenclatura
  ) => {
    setExpandedNomenclatura((prev) => {
      const key = `${direccion}-${unidad}-${unidadSubzona}-${nomenclatura}`;
      const newExpanded = { ...prev, [key]: !prev[key] };
      if (!newExpanded[key]) {
        setExpandedCargo({});
      }
      return newExpanded;
    });
  };

  const toggleExpandCargo = (
    direccion,
    unidad,
    unidadSubzona,
    nomenclatura,
    cargo
  ) => {
    setExpandedCargo((prev) => ({
      ...prev,
      [`${direccion}-${unidad}-${unidadSubzona}-${nomenclatura}-${cargo}`]:
        !prev[
          `${direccion}-${unidad}-${unidadSubzona}-${nomenclatura}-${cargo}`
        ],
    }));
  };

  const tipoDesplazamientoColumns = Array.from(
    new Set(
      data.flatMap((item) =>
        item.desplazamientos.map((d) => d.tipoDesplazamiento)
      )
    )
  );

  const today = new Date();

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
      acc["OTROS"].unidades["OTROS"].subzonas["OTROS"].nomenclaturas["OTROS"] =
        {
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
        !acc["OTROS"].unidades["OTROS"].subzonas["OTROS"].nomenclaturas["OTROS"]
          .cargos["OTROS"].grados
      ) {
        acc["OTROS"].unidades["OTROS"].subzonas["OTROS"].nomenclaturas[
          "OTROS"
        ].cargos["OTROS"].grados = {};
      }

      if (
        !acc["OTROS"].unidades["OTROS"].subzonas["OTROS"].nomenclaturas["OTROS"]
          .cargos["OTROS"].grados["OTROS"]
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

      acc[direccion].tipoDesplazamientoCounts[tipo] =
        (acc[direccion].tipoDesplazamientoCounts[tipo] || 0) + 1;

      acc[latestDesplazamientos?.direccion].tipoDesplazamientoIntCounts[tipo] =
        (acc[latestDesplazamientos?.direccion].tipoDesplazamientoIntCounts[
          tipo
        ] || 0) + 1;

      acc[direccion].unidades[unidad].tipoDesplazamientoCounts[tipo] =
        (acc[direccion].unidades[unidad].tipoDesplazamientoCounts[tipo] || 0) +
        1;

      acc[latestDesplazamientos?.direccion].unidades[
        latestDesplazamientos?.unidad
      ].tipoDesplazamientoIntCounts[tipo] =
        (acc[latestDesplazamientos?.direccion].unidades[
          latestDesplazamientos?.unidad
        ].tipoDesplazamientoIntCounts[tipo] || 0) + 1;

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

      acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
        nomenclatura
      ].tipoDesplazamientoCounts[tipo] =
        (acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
          nomenclatura
        ].tipoDesplazamientoCounts[tipo] || 0) + 1;

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
        (acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
          nomenclatura
        ].cargos[cargo].tipoDesplazamientoCounts[tipo] || 0) + 1;

      acc[latestDesplazamientos?.direccion].unidades[
        latestDesplazamientos?.unidad
      ].subzonas[latestDesplazamientos?.unidadSubzona].nomenclaturas[
        latestDesplazamientos?.nomenclatura
      ].cargos[latestDesplazamientos?.cargo].tipoDesplazamientoIntCounts[tipo] =
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
        (acc[direccion].unidades[unidad].subzonas[unidadSubzona].nomenclaturas[
          nomenclatura
        ].cargos[cargo].grados[grado].tipoDesplazamientoCounts[tipo] || 0) + 1;

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

  const totals = {
    count: 0,
    tipoDesplazamientoCounts: tipoDesplazamientoColumns.reduce(
      (acc, tipo) => ({ ...acc, [tipo]: 0 }),
      {}
    ),
  };

  Object.keys(groupedData).forEach((direccion) => {
    totals.count += groupedData[direccion].count;
    tipoDesplazamientoColumns.forEach((tipo) => {
      totals.tipoDesplazamientoCounts[tipo] +=
        groupedData[direccion].tipoDesplazamientoCounts[tipo] || 0;
    });
  });

  return (
    <div>
      {isLoading && <IsLoading />}
      <table border="1">
        <thead>
          <tr>
            <th
              onClick={() => {
                setExpandedDireccion({});
                setExpandedUnidad({});
                setExpandedUnidadSubzona({});
                setExpandedNomenclatura({});
                setExpandedCargo({});
              }}
            >
              DIRECC / UNI / SUBZ / NOMEN / CARGO{" "}
              <div>
                <img
                  src={`../../../up.png`}
                  className="img__flecha__direccion"
                />
              </div>{" "}
            </th>
            <th>LEGALIZADOS</th>
            {tipoDesplazamientoColumns.map(
              (tipo) =>
                totals.tipoDesplazamientoCounts[tipo] > 0 && (
                  <th key={tipo}>{tipo}- S</th>
                )
            )}
            {tipoDesplazamientoColumns.map(
              (tipo) =>
                totals.tipoDesplazamientoCounts[tipo] > 0 && (
                  <th key={tipo}>{tipo}</th>
                )
            )}
            <th>TOTAL LABORANDO</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData)
            .sort((a, b) => {
              if (a === "OTROS") return 1;
              if (b === "OTROS") return -1;
              if (a === "DIGIN") return -1;
              if (b === "DIGIN") return 1;
              return groupedData[b].count - groupedData[a].count;
            })
            .map((direccion) => (
              <React.Fragment key={direccion}>
                <tr>
                  <td
                    onClick={() => toggleExpandDireccion(direccion)}
                    className="direccion flecha"
                  >
                    {direccion}
                    <div>
                      <img
                        src={`../../../${
                          expandedDireccion[direccion] ? "up" : "down"
                        }.png`}
                        className="img__flecha__direccion"
                      />
                    </div>
                  </td>
                  <td
                    onClick={() => toggleExpandDireccion(direccion)}
                    className="direccion"
                  >
                    {groupedData[direccion].count}
                  </td>

                  {tipoDesplazamientoColumns.map(
                    (tipo) =>
                      totals.tipoDesplazamientoCounts[tipo] > 0 && (
                        <td
                          onClick={() => toggleExpandDireccion(direccion)}
                          className="direccion"
                          key={tipo}
                        >
                          {groupedData[direccion].tipoDesplazamientoCounts[
                            tipo
                          ] || 0}
                        </td>
                      )
                  )}

                  {tipoDesplazamientoColumns.map(
                    (tipo) =>
                      totals.tipoDesplazamientoCounts[tipo] > 0 && (
                        <td
                          onClick={() => toggleExpandDireccion(direccion)}
                          className="direccion"
                          key={tipo}
                        >
                          {groupedData[direccion].tipoDesplazamientoIntCounts[
                            tipo
                          ] || 0}
                        </td>
                      )
                  )}
                  <td
                    onClick={() => toggleExpandDireccion(direccion)}
                    className="direccion"
                  >
                    {groupedData[direccion].count -
                      tipoDesplazamientoColumns.reduce(
                        (acc, tipo) =>
                          acc +
                          (groupedData[direccion].tipoDesplazamientoCounts[
                            tipo
                          ] || 0),
                        0
                      ) +
                      tipoDesplazamientoColumns.reduce(
                        (acc, tipo) =>
                          acc +
                          (groupedData[direccion].tipoDesplazamientoIntCounts[
                            tipo
                          ] || 0),
                        0
                      )}
                  </td>
                </tr>
                {expandedDireccion[direccion] &&
                  Object.keys(groupedData[direccion].unidades).map((unidad) => (
                    <React.Fragment key={unidad}>
                      <tr>
                        <td
                          onClick={() => toggleExpandUnidad(direccion, unidad)}
                          className="unidad flecha"
                        >
                          {unidad}
                          <div>
                            <img
                              src={`../../../${
                                expandedUnidad[`${direccion}-${unidad}`]
                                  ? "up"
                                  : "down"
                              }.png`}
                              className="img__flecha__unidad"
                            />
                          </div>
                        </td>
                        <td
                          className="unidad"
                          onClick={() => toggleExpandUnidad(direccion, unidad)}
                        >
                          {groupedData[direccion].unidades[unidad].count}
                        </td>

                        {tipoDesplazamientoColumns.map(
                          (tipo) =>
                            totals.tipoDesplazamientoCounts[tipo] > 0 && (
                              <td
                                className="unidad"
                                onClick={() =>
                                  toggleExpandUnidad(direccion, unidad)
                                }
                                key={tipo}
                              >
                                {groupedData[direccion].unidades[unidad]
                                  .tipoDesplazamientoCounts[tipo] || 0}
                              </td>
                            )
                        )}

                        {tipoDesplazamientoColumns.map(
                          (tipo) =>
                            totals.tipoDesplazamientoCounts[tipo] > 0 && (
                              <td
                                className="unidad"
                                onClick={() =>
                                  toggleExpandUnidad(direccion, unidad)
                                }
                                key={tipo}
                              >
                                {groupedData[direccion].unidades[unidad]
                                  .tipoDesplazamientoIntCounts[tipo] || 0}
                              </td>
                            )
                        )}

                        <td
                          onClick={() => toggleExpandUnidad(direccion, unidad)}
                          className="unidad"
                        >
                          {groupedData[direccion].unidades[unidad].count -
                            tipoDesplazamientoColumns.reduce(
                              (acc, tipo) =>
                                acc +
                                (groupedData[direccion].unidades[unidad]
                                  .tipoDesplazamientoCounts[tipo] || 0),
                              0
                            ) +
                            tipoDesplazamientoColumns.reduce(
                              (acc, tipo) =>
                                acc +
                                (groupedData[direccion].unidades[unidad]
                                  .tipoDesplazamientoIntCounts[tipo] || 0),
                              0
                            )}
                        </td>
                      </tr>

                      {expandedUnidad[`${direccion}-${unidad}`] &&
                        Object.keys(
                          groupedData[direccion].unidades[unidad].subzonas
                        ).map((unidadSubzona) => (
                          <React.Fragment key={unidadSubzona}>
                            <tr>
                              <td
                                onClick={() =>
                                  toggleExpandUnidadSubzona(
                                    direccion,
                                    unidad,
                                    unidadSubzona
                                  )
                                }
                                className="unidadSubzona flecha"
                              >
                                {unidadSubzona}
                                <div>
                                  <img
                                    src={`../../../${
                                      expandedUnidadSubzona[
                                        `${direccion}-${unidad}-${unidadSubzona}`
                                      ]
                                        ? "up"
                                        : "down"
                                    }.png`}
                                    className="img__flecha__unidadSubzona"
                                  />
                                </div>
                              </td>
                              <td
                                onClick={() =>
                                  toggleExpandUnidadSubzona(
                                    direccion,
                                    unidad,
                                    unidadSubzona
                                  )
                                }
                                className="unidadSubzona"
                              >
                                {
                                  groupedData[direccion].unidades[unidad]
                                    .subzonas[unidadSubzona].count
                                }
                              </td>
                              {tipoDesplazamientoColumns.map(
                                (tipo) =>
                                  totals.tipoDesplazamientoCounts[tipo] > 0 && (
                                    <td
                                      onClick={() =>
                                        toggleExpandUnidadSubzona(
                                          direccion,
                                          unidad,
                                          unidadSubzona
                                        )
                                      }
                                      className="unidadSubzona"
                                      key={tipo}
                                    >
                                      {groupedData[direccion].unidades[unidad]
                                        .subzonas[unidadSubzona]
                                        .tipoDesplazamientoCounts[tipo] || 0}
                                    </td>
                                  )
                              )}

                              {tipoDesplazamientoColumns.map(
                                (tipo) =>
                                  totals.tipoDesplazamientoCounts[tipo] > 0 && (
                                    <td
                                      onClick={() =>
                                        toggleExpandUnidadSubzona(
                                          direccion,
                                          unidad,
                                          unidadSubzona
                                        )
                                      }
                                      className="unidadSubzona"
                                      key={tipo}
                                    >
                                      {groupedData[direccion].unidades[unidad]
                                        .subzonas[unidadSubzona]
                                        .tipoDesplazamientoIntCounts[tipo] || 0}
                                    </td>
                                  )
                              )}

                              <td
                                onClick={() =>
                                  toggleExpandUnidadSubzona(
                                    direccion,
                                    unidad,
                                    unidadSubzona
                                  )
                                }
                                className="unidadSubzona"
                              >
                                {groupedData[direccion].unidades[unidad]
                                  .subzonas[unidadSubzona].count -
                                  tipoDesplazamientoColumns.reduce(
                                    (acc, tipo) =>
                                      acc +
                                      (groupedData[direccion].unidades[unidad]
                                        .subzonas[unidadSubzona]
                                        .tipoDesplazamientoCounts[tipo] || 0),
                                    0
                                  ) +
                                  tipoDesplazamientoColumns.reduce(
                                    (acc, tipo) =>
                                      acc +
                                      (groupedData[direccion].unidades[unidad]
                                        .subzonas[unidadSubzona]
                                        .tipoDesplazamientoIntCounts[tipo] ||
                                        0),
                                    0
                                  )}
                              </td>
                            </tr>
                            {expandedUnidadSubzona[
                              `${direccion}-${unidad}-${unidadSubzona}`
                            ] &&
                              Object.keys(
                                groupedData[direccion].unidades[unidad]
                                  .subzonas[unidadSubzona].nomenclaturas
                              ).map((nomenclatura) => (
                                <React.Fragment key={nomenclatura}>
                                  <tr>
                                    <td
                                      onClick={() =>
                                        toggleExpandNomenclatura(
                                          direccion,
                                          unidad,
                                          unidadSubzona,
                                          nomenclatura
                                        )
                                      }
                                      className="nomenclatura flecha"
                                    >
                                      {nomenclatura}
                                      <div>
                                        <img
                                          src={`../../../${
                                            expandedNomenclatura[
                                              `${direccion}-${unidad}-${unidadSubzona}-${nomenclatura}`
                                            ]
                                              ? "up"
                                              : "down"
                                          }.png`}
                                          className="img__flecha__nomenclatura"
                                        />
                                      </div>
                                    </td>
                                    <td
                                      onClick={() =>
                                        toggleExpandNomenclatura(
                                          direccion,
                                          unidad,
                                          unidadSubzona,
                                          nomenclatura
                                        )
                                      }
                                      className="nomenclatura"
                                    >
                                      {
                                        groupedData[direccion].unidades[unidad]
                                          .subzonas[unidadSubzona]
                                          .nomenclaturas[nomenclatura].count
                                      }
                                    </td>
                                    {tipoDesplazamientoColumns.map(
                                      (tipo) =>
                                        totals.tipoDesplazamientoCounts[tipo] >
                                          0 && (
                                          <td
                                            onClick={() =>
                                              toggleExpandNomenclatura(
                                                direccion,
                                                unidad,
                                                unidadSubzona,
                                                nomenclatura
                                              )
                                            }
                                            className="nomenclatura"
                                            key={tipo}
                                          >
                                            {groupedData[direccion].unidades[
                                              unidad
                                            ].subzonas[unidadSubzona]
                                              .nomenclaturas[nomenclatura]
                                              .tipoDesplazamientoCounts[tipo] ||
                                              0}
                                          </td>
                                        )
                                    )}

                                    {tipoDesplazamientoColumns.map(
                                      (tipo) =>
                                        totals.tipoDesplazamientoCounts[tipo] >
                                          0 && (
                                          <td
                                            onClick={() =>
                                              toggleExpandNomenclatura(
                                                direccion,
                                                unidad,
                                                unidadSubzona,
                                                nomenclatura
                                              )
                                            }
                                            className="nomenclatura"
                                            key={tipo}
                                          >
                                            {groupedData[direccion].unidades[
                                              unidad
                                            ].subzonas[unidadSubzona]
                                              .nomenclaturas[nomenclatura]
                                              .tipoDesplazamientoIntCounts[
                                              tipo
                                            ] || 0}
                                          </td>
                                        )
                                    )}

                                    <td
                                      onClick={() =>
                                        toggleExpandNomenclatura(
                                          direccion,
                                          unidad,
                                          unidadSubzona,
                                          nomenclatura
                                        )
                                      }
                                      className="nomenclatura"
                                    >
                                      {groupedData[direccion].unidades[unidad]
                                        .subzonas[unidadSubzona].nomenclaturas[
                                        nomenclatura
                                      ].count -
                                        tipoDesplazamientoColumns.reduce(
                                          (acc, tipo) =>
                                            acc +
                                            (groupedData[direccion].unidades[
                                              unidad
                                            ].subzonas[unidadSubzona]
                                              .nomenclaturas[nomenclatura]
                                              .tipoDesplazamientoCounts[tipo] ||
                                              0),
                                          0
                                        ) +
                                        tipoDesplazamientoColumns.reduce(
                                          (acc, tipo) =>
                                            acc +
                                            (groupedData[direccion].unidades[
                                              unidad
                                            ].subzonas[unidadSubzona]
                                              .nomenclaturas[nomenclatura]
                                              .tipoDesplazamientoIntCounts[
                                              tipo
                                            ] || 0),
                                          0
                                        )}
                                    </td>
                                  </tr>
                                  {expandedNomenclatura[
                                    `${direccion}-${unidad}-${unidadSubzona}-${nomenclatura}`
                                  ] &&
                                    Object.keys(
                                      groupedData[direccion].unidades[unidad]
                                        .subzonas[unidadSubzona].nomenclaturas[
                                        nomenclatura
                                      ].cargos
                                    ).map((cargo) => (
                                      <React.Fragment key={cargo}>
                                        <tr>
                                          <td
                                            onClick={() =>
                                              toggleExpandCargo(
                                                direccion,
                                                unidad,
                                                unidadSubzona,
                                                nomenclatura,
                                                cargo
                                              )
                                            }
                                            className="cargo flecha"
                                          >
                                            {cargo}
                                            <div>
                                              <img
                                                src={`../../../${
                                                  expandedCargo[
                                                    `${direccion}-${unidad}-${unidadSubzona}-${nomenclatura}-${cargo}`
                                                  ]
                                                    ? "up"
                                                    : "down"
                                                }.png`}
                                                className="img__flecha__cargo"
                                              />
                                            </div>
                                          </td>
                                          <td
                                            className="cargo"
                                            onClick={() =>
                                              toggleExpandCargo(
                                                direccion,
                                                unidad,
                                                unidadSubzona,
                                                nomenclatura,
                                                cargo
                                              )
                                            }
                                          >
                                            {
                                              groupedData[direccion].unidades[
                                                unidad
                                              ].subzonas[unidadSubzona]
                                                .nomenclaturas[nomenclatura]
                                                .cargos[cargo].count
                                            }
                                          </td>
                                          {tipoDesplazamientoColumns.map(
                                            (tipo) =>
                                              totals.tipoDesplazamientoCounts[
                                                tipo
                                              ] > 0 && (
                                                <td
                                                  className="cargo"
                                                  onClick={() =>
                                                    toggleExpandCargo(
                                                      direccion,
                                                      unidad,
                                                      unidadSubzona,
                                                      nomenclatura,
                                                      cargo
                                                    )
                                                  }
                                                  key={tipo}
                                                >
                                                  {groupedData[direccion]
                                                    .unidades[unidad].subzonas[
                                                    unidadSubzona
                                                  ].nomenclaturas[nomenclatura]
                                                    .cargos[cargo]
                                                    .tipoDesplazamientoCounts[
                                                    tipo
                                                  ] || 0}
                                                </td>
                                              )
                                          )}

                                          {tipoDesplazamientoColumns.map(
                                            (tipo) =>
                                              totals.tipoDesplazamientoCounts[
                                                tipo
                                              ] > 0 && (
                                                <td
                                                  className="cargo"
                                                  onClick={() =>
                                                    toggleExpandCargo(
                                                      direccion,
                                                      unidad,
                                                      unidadSubzona,
                                                      nomenclatura,
                                                      cargo
                                                    )
                                                  }
                                                  key={tipo}
                                                >
                                                  {groupedData[direccion]
                                                    .unidades[unidad].subzonas[
                                                    unidadSubzona
                                                  ].nomenclaturas[nomenclatura]
                                                    .cargos[cargo]
                                                    .tipoDesplazamientoIntCounts[
                                                    tipo
                                                  ] || 0}
                                                </td>
                                              )
                                          )}

                                          <td
                                            onClick={() =>
                                              toggleExpandCargo(
                                                direccion,
                                                unidad,
                                                unidadSubzona,
                                                nomenclatura,
                                                cargo
                                              )
                                            }
                                            className="cargo"
                                          >
                                            {groupedData[direccion].unidades[
                                              unidad
                                            ].subzonas[unidadSubzona]
                                              .nomenclaturas[nomenclatura]
                                              .cargos[cargo].count -
                                              tipoDesplazamientoColumns.reduce(
                                                (acc, tipo) =>
                                                  acc +
                                                  (groupedData[direccion]
                                                    .unidades[unidad].subzonas[
                                                    unidadSubzona
                                                  ].nomenclaturas[nomenclatura]
                                                    .cargos[cargo]
                                                    .tipoDesplazamientoCounts[
                                                    tipo
                                                  ] || 0),
                                                0
                                              ) +
                                              tipoDesplazamientoColumns.reduce(
                                                (acc, tipo) =>
                                                  acc +
                                                  (groupedData[direccion]
                                                    .unidades[unidad].subzonas[
                                                    unidadSubzona
                                                  ].nomenclaturas[nomenclatura]
                                                    .cargos[cargo]
                                                    .tipoDesplazamientoIntCounts[
                                                    tipo
                                                  ] || 0),
                                                0
                                              )}
                                          </td>
                                        </tr>
                                        {expandedCargo[
                                          `${direccion}-${unidad}-${unidadSubzona}-${nomenclatura}-${cargo}`
                                        ] &&
                                          Object.keys(
                                            groupedData[direccion].unidades[
                                              unidad
                                            ].subzonas[unidadSubzona]
                                              .nomenclaturas[nomenclatura]
                                              .cargos[cargo].grados
                                          ).map((grado) => (
                                            <React.Fragment key={grado}>
                                              <tr>
                                                <td className="grado">
                                                  {grado}
                                                </td>
                                                <td className="grado">
                                                  {
                                                    groupedData[direccion]
                                                      .unidades[unidad]
                                                      .subzonas[unidadSubzona]
                                                      .nomenclaturas[
                                                      nomenclatura
                                                    ].cargos[cargo].grados[
                                                      grado
                                                    ].count
                                                  }
                                                </td>
                                                {tipoDesplazamientoColumns.map(
                                                  (tipo) =>
                                                    totals
                                                      .tipoDesplazamientoCounts[
                                                      tipo
                                                    ] > 0 && (
                                                      <td
                                                        className="grado"
                                                        key={tipo}
                                                      >
                                                        {groupedData[direccion]
                                                          .unidades[unidad]
                                                          .subzonas[
                                                          unidadSubzona
                                                        ].nomenclaturas[
                                                          nomenclatura
                                                        ].cargos[cargo].grados[
                                                          grado
                                                        ]
                                                          .tipoDesplazamientoCounts[
                                                          tipo
                                                        ] || 0}
                                                      </td>
                                                    )
                                                )}

                                                {tipoDesplazamientoColumns.map(
                                                  (tipo) =>
                                                    totals
                                                      .tipoDesplazamientoCounts[
                                                      tipo
                                                    ] > 0 && (
                                                      <td
                                                        className="grado"
                                                        key={tipo}
                                                      >
                                                        {groupedData[direccion]
                                                          .unidades[unidad]
                                                          .subzonas[
                                                          unidadSubzona
                                                        ].nomenclaturas[
                                                          nomenclatura
                                                        ].cargos[cargo].grados[
                                                          grado
                                                        ]
                                                          .tipoDesplazamientoIntCounts[
                                                          tipo
                                                        ] || 0}
                                                      </td>
                                                    )
                                                )}

                                                <td className="grado">
                                                  {groupedData[direccion]
                                                    .unidades[unidad].subzonas[
                                                    unidadSubzona
                                                  ].nomenclaturas[nomenclatura]
                                                    .cargos[cargo].grados[grado]
                                                    .count -
                                                    tipoDesplazamientoColumns.reduce(
                                                      (acc, tipo) =>
                                                        acc +
                                                        (groupedData[direccion]
                                                          .unidades[unidad]
                                                          .subzonas[
                                                          unidadSubzona
                                                        ].nomenclaturas[
                                                          nomenclatura
                                                        ].cargos[cargo].grados[
                                                          grado
                                                        ]
                                                          .tipoDesplazamientoCounts[
                                                          tipo
                                                        ] || 0),
                                                      0
                                                    ) +
                                                    tipoDesplazamientoColumns.reduce(
                                                      (acc, tipo) =>
                                                        acc +
                                                        (groupedData[direccion]
                                                          .unidades[unidad]
                                                          .subzonas[
                                                          unidadSubzona
                                                        ].nomenclaturas[
                                                          nomenclatura
                                                        ].cargos[cargo].grados[
                                                          grado
                                                        ]
                                                          .tipoDesplazamientoIntCounts[
                                                          tipo
                                                        ] || 0),
                                                      0
                                                    )}
                                                </td>
                                              </tr>
                                            </React.Fragment>
                                          ))}
                                      </React.Fragment>
                                    ))}
                                </React.Fragment>
                              ))}
                          </React.Fragment>
                        ))}
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}

          <tr>
            <td>Total</td>
            <td>{totals.count}</td>
            {tipoDesplazamientoColumns.map(
              (tipo) =>
                totals.tipoDesplazamientoCounts[tipo] > 0 && (
                  <td key={tipo}>
                    {totals.tipoDesplazamientoCounts[tipo] || 0}
                  </td>
                )
            )}

            {tipoDesplazamientoColumns.map(
              (tipo) =>
                totals.tipoDesplazamientoCounts[tipo] > 0 && (
                  <td key={tipo}>
                    {totals.tipoDesplazamientoCounts[tipo] || 0}
                  </td>
                )
            )}
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ResumenTh;