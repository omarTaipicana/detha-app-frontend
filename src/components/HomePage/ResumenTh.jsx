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
  const [expandedCargo, setExpandedCargo] = useState({}); // Nueva expansión para cargo

  const toggleExpandDireccion = (direccion) => {
    setExpandedDireccion((prev) => {
      const newExpanded = { ...prev, [direccion]: !prev[direccion] };
      if (!newExpanded[direccion]) {
        // Cerrar todas las subcategorías si se cierra una dirección
        setExpandedUnidad({});
        setExpandedUnidadSubzona({});
        setExpandedNomenclatura({});
        setExpandedCargo({});
      }
      return newExpanded;
    });
  };

  const toggleExpandUnidad = (direccion, unidad) => {
    setExpandedUnidad((prev) => ({
      ...prev,
      [`${direccion}-${unidad}`]: !prev[`${direccion}-${unidad}`],
    }));
  };

  const toggleExpandUnidadSubzona = (direccion, unidad, unidadSubzona) => {
    setExpandedUnidadSubzona((prev) => ({
      ...prev,
      [`${direccion}-${unidad}-${unidadSubzona}`]:
        !prev[`${direccion}-${unidad}-${unidadSubzona}`],
    }));
  };

  const toggleExpandNomenclatura = (
    direccion,
    unidad,
    unidadSubzona,
    nomenclatura
  ) => {
    setExpandedNomenclatura((prev) => ({
      ...prev,
      [`${direccion}-${unidad}-${unidadSubzona}-${nomenclatura}`]:
        !prev[`${direccion}-${unidad}-${unidadSubzona}-${nomenclatura}`],
    }));
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

    if (!latestPase) return acc;

    const { direccion, unidad, unidadSubzona, nomenclatura, cargo } =
      latestPase;

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
        cargos: {},
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
        cargos: {},
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
        cargos: {},
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
            <th>DIRECC / UNI / SUBZ / NOMEN / CARGO</th>
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
          {Object.keys(groupedData).map((direccion) => (
            <React.Fragment key={direccion}>
              <tr>
                <td
                  onClick={() => toggleExpandDireccion(direccion)}
                  className="direccion"
                >
                  {direccion}
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
                        className="unidad"
                      >
                        {unidad}
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
                              className="unidadSubzona"
                            >
                              {unidadSubzona}
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
                              {groupedData[direccion].unidades[unidad].subzonas[
                                unidadSubzona
                              ].count -
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
                                      .tipoDesplazamientoIntCounts[tipo] || 0),
                                  0
                                )}
                            </td>
                          </tr>
                          {expandedUnidadSubzona[
                            `${direccion}-${unidad}-${unidadSubzona}`
                          ] &&
                            Object.keys(
                              groupedData[direccion].unidades[unidad].subzonas[
                                unidadSubzona
                              ].nomenclaturas
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
                                    className="nomenclatura"
                                  >
                                    {nomenclatura}
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
                                        .subzonas[unidadSubzona].nomenclaturas[
                                        nomenclatura
                                      ].count
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
                                        <td className="cargo">{cargo}</td>
                                        <td>
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
                                              <td key={tipo}>
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
                                              <td key={tipo}>
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

                                        <td className="direccion">
                                          {
                                            // Realizar la resta y la suma
                                            groupedData[direccion].unidades[
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
                                              )
                                          }
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
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ResumenTh;
