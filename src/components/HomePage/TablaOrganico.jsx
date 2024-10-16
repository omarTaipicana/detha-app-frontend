import React, { useEffect, useRef, useState } from "react";
import "./style/TablaOrganico.css";
import axios from "axios";
import getConfigToken from "../../services/getConfigToken";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import domtoimage from "dom-to-image";

const TablaOrganico = () => {
  const urlBase = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.user ? localStorage.user : 0);
  const tableRef = useRef(null);

  const [organicos, setOrganicos] = useState([]);
  const [servidores, setServidores] = useState([]);
  const [filteredOrganicos, setFilteredOrganicos] = useState([]);
  const [filteredServidores, setFilteredServidores] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    axios
      .get(`${urlBase}/organicos`, getConfigToken())
      .then((res) => {
        setOrganicos(res.data);
        filterOrganicos(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .get(`${urlBase}/servidores`, getConfigToken())
      .then((res) => {
        setServidores(res.data);
        filterServidores(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // -------------------------------------------------------------------------------------------------------

  const prueba = () => {
    const objProcesadoOrg = {};

    filteredOrganicos.forEach((item) => {
      const { nomenclatura, grado, total } = item;

      if (!objProcesadoOrg[nomenclatura]) {
        objProcesadoOrg[nomenclatura] = {
          nomenclatura,
          organico: { [grado]: total },
          actual: {},
          defExe: {},
        };
      } else {
        if (!objProcesadoOrg[nomenclatura].organico[grado]) {
          objProcesadoOrg[nomenclatura].organico[grado] = total;
        } else {
          objProcesadoOrg[nomenclatura].organico[grado] += total;
        }
      }
    });

    filteredServidores.forEach((item) => {
      const ultimoPase = item.pases
        ?.slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      const ultimoAscenso = item.ascensos
        ?.slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      const nomenclatura = ultimoPase?.nomenclatura || "Sin Nomenclatura";
      const grado = ultimoAscenso?.grado || "Sin Grado";
      const total = item.total || 1;

      if (objProcesadoOrg[nomenclatura]) {
        if (!objProcesadoOrg[nomenclatura].actual[grado]) {
          objProcesadoOrg[nomenclatura].actual[grado] = total;
        } else {
          objProcesadoOrg[nomenclatura].actual[grado] += total;
        }
      } else {
        objProcesadoOrg[nomenclatura] = {
          nomenclatura,
          organico: {},
          actual: { [grado]: total },
          defExe: {},
        };
      }
    });

    Object.keys(objProcesadoOrg).forEach((nomenclatura) => {
      const orgItem = objProcesadoOrg[nomenclatura];
      const grados = new Set([
        ...Object.keys(orgItem.organico),
        ...Object.keys(orgItem.actual),
      ]);

      grados.forEach((grado) => {
        const actualValue = orgItem.actual[grado] || 0;
        const organicoValue = orgItem.organico[grado] || 0;
        orgItem.defExe[grado] = actualValue - organicoValue;
      });
    });

    const dataArray = Object.values(objProcesadoOrg);
    return dataArray;
  };

  const objProcesadoPrueba = prueba();

  const handleSort2 = (objectName, key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ objectName, key, direction });
  };

  const sortedItems2 = [...objProcesadoPrueba].sort((a, b) => {
    if (sortConfig.key && sortConfig.objectName) {
      const directionMultiplier = sortConfig.direction === "asc" ? 1 : -1;

      const aValue = a[sortConfig.objectName]?.[sortConfig.key] || 0;
      const bValue = b[sortConfig.objectName]?.[sortConfig.key] || 0;

      return directionMultiplier * (aValue - bValue);
    }
    return 0;
  });

  const resetFilterAndSort = () => {
    filterOrganicos(organicos);
    setSortConfig({ key: null, direction: "asc" });
  };

  const getTotalForItem = (item, objName) => {
    const gradesObj = item[objName] || {};
    return (
      (gradesObj.GRAD || 0) +
      (gradesObj.GRAI || 0) +
      (gradesObj.CRNL || 0) +
      (gradesObj.TCNL || 0) +
      (gradesObj.MAYR || 0) +
      (gradesObj.CPTN || 0) +
      (gradesObj.TNTE || 0) +
      (gradesObj.SBTE || 0) +
      (gradesObj.SUBM || 0) +
      (gradesObj.SUBP || 0) +
      (gradesObj.SUBS || 0) +
      (gradesObj.SGOP || 0) +
      (gradesObj.SGOS || 0) +
      (gradesObj.CBOP || 0) +
      (gradesObj.CBOS || 0) +
      (gradesObj.POLI || 0)
    );
  };

  const totalesPorGrado = (processedData) => {
    const result = {
      organico: { total: 0 },
      actual: { total: 0 },
      defExe: { total: 0 },
    };

    processedData.forEach((item) => {
      Object.entries(item.organico).forEach(([grado, total]) => {
        if (!result.organico[grado]) {
          result.organico[grado] = 0;
        }
        result.organico[grado] += total;
        result.organico.total += total;
      });

      Object.entries(item.actual).forEach(([grado, total]) => {
        if (!result.actual[grado]) {
          result.actual[grado] = 0;
        }
        result.actual[grado] += total;
        result.actual.total += total;
      });

      Object.keys(item.organico).forEach((grado) => {
        const actualTotal = item.actual[grado] || 0;
        const organicoTotal = item.organico[grado] || 0;
        const diferencia = actualTotal - organicoTotal;

        if (!result.defExe[grado]) {
          result.defExe[grado] = 0;
        }
        result.defExe[grado] = diferencia;

        result.defExe.total += diferencia;
      });

      Object.keys(item.actual).forEach((grado) => {
        if (!item.organico[grado]) {
          const actualTotal = item.actual[grado] || 0;

          if (!result.defExe[grado]) {
            result.defExe[grado] = 0;
          }
          result.defExe[grado] = actualTotal;

          result.defExe.total += actualTotal;
        }
      });
    });

    return result;
  };

  const totals = totalesPorGrado(objProcesadoPrueba);
  

  // -------------------------------------------------------------------------------------
  const filterOrganicos = (organicos) => {
    const filtered = organicos.filter(
      user.unidadSubzona === "Planta Administrativa DIGIN"
        ? (org) => org.id > 0
        : user.unidadSubzona.slice(0, 21) === "Planta Administrativa"
        ? (org) => org.siglasDireccion === user.direccion
        : user.tipoDesignacion === "NOPERA"
        ? (org) => org.siglaUnidadGrupo === user.unidad
        : (org) =>
            org.unidadSubzona === user.unidadSubzona &&
            org.siglaUnidadGrupo === user.unidad
    );
    setFilteredOrganicos(filtered);
  };

  const processOrgnaicos = () => {
    const objProcesadoOrg = {};
    filteredOrganicos.forEach((item) => {
      const { nomenclatura, grado, total } = item;
      if (!objProcesadoOrg[nomenclatura]) {
        objProcesadoOrg[nomenclatura] = { nomenclatura, [grado]: total };
      } else {
        if (!objProcesadoOrg[nomenclatura][grado]) {
          objProcesadoOrg[nomenclatura][grado] = total;
        } else {
          objProcesadoOrg[nomenclatura][grado] += total;
        }
      }
    });
    const dataArray = Object.values(objProcesadoOrg);
    return dataArray;
  };

  const objProcesadoOrg = processOrgnaicos();

  const totalesPorGradoOrg = filteredOrganicos.reduce((acc, item) => {
    const { grado, total } = item;
    if (!acc[grado]) {
      acc[grado] = 0;
    }
    acc[grado] += total;
    return acc;
  }, {});

  const getTotalForItemOrg = (item) => {
    return (
      (item.GRAD || 0) +
      (item.GRAI || 0) +
      (item.CRNL || 0) +
      (item.TCNL || 0) +
      (item.MAYR || 0) +
      (item.CPTN || 0) +
      (item.TNTE || 0) +
      (item.SBTE || 0) +
      (item.SUBM || 0) +
      (item.SUBP || 0) +
      (item.SUBS || 0) +
      (item.SGOP || 0) +
      (item.SGOS || 0) +
      (item.CBOP || 0) +
      (item.CBOS || 0) +
      (item.POLI || 0)
    );
  };

  // -------------------------------------------------------------------------------------

  const filterServidores = (servidores) => {
    const filtered = servidores.filter((serv) => {
      const ultimoPase = serv.pases
        ?.slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      if (user.unidadSubzona === "Planta Administrativa DIGIN") {
        return serv.id;
      } else if (user.unidadSubzona.slice(0, 21) === "Planta Administrativa") {
        return ultimoPase?.direccion === user.direccion;
      } else if (user.tipoDesignacion === "NOPERA") {
        return ultimoPase?.unidad === user.unidad;
      } else {
        return (
          ultimoPase?.unidadSubzona === user.unidadSubzona &&
          ultimoPase?.unidad === user.unidad
        );
      }
    });

    setFilteredServidores(filtered);
  };

  const processServidores = () => {
    const objProcesadoServ = {};

    filteredServidores.forEach((item) => {
      const ultimoPase = item.pases
        ?.slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      const ultimoAscenso = item.ascensos
        ?.slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      const nomenclatura = ultimoPase?.nomenclatura || "Sin Nomenclatura";
      const grado = ultimoAscenso?.grado || "Sin Grado";
      const total = item.total || 1;

      if (!objProcesadoServ[nomenclatura]) {
        objProcesadoServ[nomenclatura] = { nomenclatura };
      }

      if (!objProcesadoServ[nomenclatura][grado]) {
        objProcesadoServ[nomenclatura][grado] = total;
      } else {
        objProcesadoServ[nomenclatura][grado] += total;
      }
    });

    const dataArray = Object.values(objProcesadoServ);

    return dataArray;
  };

  const objProcesadoServ = processServidores();

  const totalesPorGradoServ = filteredServidores.reduce((acc, item) => {
    const ultimoAscenso = item.ascensos
      ?.slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const grado = ultimoAscenso?.grado;
    let total = item.total || 1;
    if (!acc[grado]) {
      acc[grado] = 0;
    }
    acc[grado] += total;
    return acc;
  }, {});

  const getTotalForItemServ = (item) => {
    const filteredItem = objProcesadoServ.find(
      (dataItem) => dataItem.nomenclatura === item.nomenclatura
    );

    if (!filteredItem) {
      return 0;
    }
    return (
      (filteredItem.GRAD || 0) +
      (filteredItem.GRAI || 0) +
      (filteredItem.CRNL || 0) +
      (filteredItem.TCNL || 0) +
      (filteredItem.MAYR || 0) +
      (filteredItem.CPTN || 0) +
      (filteredItem.TNTE || 0) +
      (filteredItem.SBTE || 0) +
      (filteredItem.SUBM || 0) +
      (filteredItem.SUBP || 0) +
      (filteredItem.SUBS || 0) +
      (filteredItem.SGOP || 0) +
      (filteredItem.SGOS || 0) +
      (filteredItem.CBOP || 0) +
      (filteredItem.CBOS || 0) +
      (filteredItem.POLI || 0)
    );
  };
  const getTotalForItemServTotal = (item) => {
    return (
      (item.GRAD || 0) +
      (item.GRAI || 0) +
      (item.CRNL || 0) +
      (item.TCNL || 0) +
      (item.MAYR || 0) +
      (item.CPTN || 0) +
      (item.TNTE || 0) +
      (item.SBTE || 0) +
      (item.SUBM || 0) +
      (item.SUBP || 0) +
      (item.SUBS || 0) +
      (item.SGOP || 0) +
      (item.SGOS || 0) +
      (item.CBOP || 0) +
      (item.CBOS || 0) +
      (item.POLI || 0)
    );
  };
  // -------------------------------------------------------------------------------------------------

  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = [...objProcesadoOrg].sort((a, b) => {
    if (sortConfig.key) {
      const directionMultiplier = sortConfig.direction === "asc" ? 1 : -1;
      if (sortConfig.key === "total") {
        return (
          directionMultiplier * (getTotalForItemOrg(a) - getTotalForItemOrg(b))
        );
      } else {
        return (
          directionMultiplier *
          ((a[sortConfig.key] || 0) - (b[sortConfig.key] || 0))
        );
      }
    }
    return 0;
  });

  const getValueServidor = (nomenclatura, gradoServ) => {
    const filteredItem = objProcesadoServ.find(
      (dataItem) => dataItem.nomenclatura === nomenclatura
    );

    return filteredItem && filteredItem[gradoServ] !== undefined
      ? filteredItem[gradoServ]
      : 0;
  };

  const exportToPDF = () => {
    const node = document.getElementById("tableRef");
    const scale = 2;
    domtoimage
      .toPng(node, {
        width: node.scrollWidth * scale,
        height: node.scrollHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${node.scrollWidth}px`,
          height: `${node.scrollHeight}px`,
          left: "-200px",
        },
      })
      .then((dataUrl) => {
        const img = new Image();
        img.src = dataUrl;

        img.onload = () => {
          const doc = new jsPDF("l", "mm", "a4");
          const imgWidth = 280;
          const imgHeight = (img.height * imgWidth) / img.width;

          doc.addImage(img, "PNG", 10, 10, imgWidth, imgHeight);
          doc.save("TablaOrganicos.pdf");
        };
      })
      .catch((error) => {
        console.error("Error al generar la imagen:", error);
      });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.table_to_sheet(tableRef.current);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "table.xlsx");
  };

  return (
    // <div>
    //   <h2 className="home_mesagge">TABLA DE DEFICIT O EXCESO</h2>
    //   <button onClick={exportToExcel}>Exportar a Excel</button>
    //   <button onClick={exportToPDF}>Exportar a PDF</button>
    //   <table id="tableRef" ref={tableRef}>
    //     <thead className="thead__organico">
    //       <tr>
    //         <th rowSpan={2} onClick={resetFilterAndSort}>
    //           NOMENCLATURA
    //         </th>
    //         <th colSpan="3">GRAI</th>
    //         <th colSpan="3">GRAD</th>
    //         <th colSpan="3">CRNL</th>
    //         <th colSpan="3">TCNL</th>
    //         <th colSpan="3">MAYR</th>
    //         <th colSpan="3">CPTN</th>
    //         <th colSpan="3">TNTE</th>
    //         <th colSpan="3">SBTE</th>
    //         <th colSpan="3">SUBM</th>
    //         <th colSpan="3">SUBP</th>
    //         <th colSpan="3">SUBS</th>
    //         <th colSpan="3">SGOP</th>
    //         <th colSpan="3">SGOS</th>
    //         <th colSpan="3">CBOP</th>
    //         <th colSpan="3">CBOS</th>
    //         <th colSpan="3">POLI</th>
    //         <th colSpan="3">TOTAL</th>
    //       </tr>
    //       <tr>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("GRAI")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("GRAI")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("GRAI")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("GRAD")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("GRAD")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("GRAD")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("CRNL")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("CRNL")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("CRNL")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("TCNL")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("TCNL")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("TCNL")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("MAYR")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("MAYR")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("MAYR")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("CPTN")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("CPTN")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("CPTN")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("TNTE")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("TNTE")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("TNTE")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("SBTE")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("SBTE")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("SBTE")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("SUBM")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("SUBM")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("SUBM")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("SUBP")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("SUBP")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("SUBP")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("SUBS")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("SUBS")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("SUBS")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("SGOP")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("SGOP")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("SGOP")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("SGOS")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("SGOS")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("SGOS")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("CBOP")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("CBOP")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("CBOP")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("CBOS")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("CBOS")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("CBOS")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("POLI")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("POLI")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("POLI")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //         <th
    //           className="texto__vertical tv1"
    //           onClick={() => handleSort("total")}
    //         >
    //           Aprobado
    //         </th>
    //         <th
    //           className="texto__vertical tv2"
    //           onClick={() => handleSort("total")}
    //         >
    //           Actual
    //         </th>
    //         <th
    //           className="texto__vertical tv3"
    //           onClick={() => handleSort("total")}
    //         >
    //           Déficit / Exceso
    //         </th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {sortedItems.map((item) => (
    //         <tr key={item.nomenclatura}>
    //           <td className="nomenclatura">{item.nomenclatura}</td>

    //           <td className={`cn1 ${item.GRAI > 0 && "cn_ap_color"}`}>
    //             {item.GRAI || 0}
    //           </td>
    //           <td
    //             className={`cn1 ${
    //               getValueServidor(item.nomenclatura, "GRAI") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "GRAI")}
    //           </td>
    //           <td
    //             className={`cn1 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "GRAI") || 0) -
    //                 (item.GRAI || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "GRAI") || 0) -
    //                     (item.GRAI || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "GRAI") || 0) -
    //               (item.GRAI || 0)}
    //           </td>

    //           <td className={`cn2 ${item.GRAD > 0 && "cn_ap_color"}`}>
    //             {item.GRAD || 0}
    //           </td>
    //           <td
    //             className={`cn2 ${
    //               getValueServidor(item.nomenclatura, "GRAD") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "GRAD")}
    //           </td>
    //           <td
    //             className={`cn2 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "GRAD") || 0) -
    //                 (item.GRAD || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "GRAD") || 0) -
    //                     (item.GRAD || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "GRAD") || 0) -
    //               (item.GRAD || 0)}
    //           </td>

    //           <td className={`cn1 ${item.CRNL > 0 && "cn_ap_color"}`}>
    //             {item.CRNL || 0}
    //           </td>
    //           <td
    //             className={`cn1 ${
    //               getValueServidor(item.nomenclatura, "CRNL") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "CRNL")}
    //           </td>
    //           <td
    //             className={`cn1 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "CRNL") || 0) -
    //                 (item.CRNL || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "CRNL") || 0) -
    //                     (item.CRNL || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "CRNL") || 0) -
    //               (item.CRNL || 0)}
    //           </td>

    //           <td className={`cn2 ${item.TCNL > 0 && "cn_ap_color"}`}>
    //             {item.TCNL || 0}
    //           </td>
    //           <td
    //             className={`cn2 ${
    //               getValueServidor(item.nomenclatura, "TCNL") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "TCNL")}
    //           </td>
    //           <td
    //             className={`cn2 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "TCNL") || 0) -
    //                 (item.TCNL || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "TCNL") || 0) -
    //                     (item.TCNL || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "TCNL") || 0) -
    //               (item.TCNL || 0)}
    //           </td>

    //           <td className={`cn1 ${item.MAYR > 0 && "cn_ap_color"}`}>
    //             {item.MAYR || 0}
    //           </td>
    //           <td
    //             className={`cn1 ${
    //               getValueServidor(item.nomenclatura, "MAYR") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "MAYR")}
    //           </td>
    //           <td
    //             className={`cn1 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "MAYR") || 0) -
    //                 (item.MAYR || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "MAYR") || 0) -
    //                     (item.MAYR || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "MAYR") || 0) -
    //               (item.MAYR || 0)}
    //           </td>

    //           <td className={`cn2 ${item.CPTN > 0 && "cn_ap_color"}`}>
    //             {item.CPTN || 0}
    //           </td>
    //           <td
    //             className={`cn2 ${
    //               getValueServidor(item.nomenclatura, "CPTN") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "CPTN")}
    //           </td>
    //           <td
    //             className={`cn2 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "CPTN") || 0) -
    //                 (item.CPTN || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "CPTN") || 0) -
    //                     (item.CPTN || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "CPTN") || 0) -
    //               (item.CPTN || 0)}
    //           </td>

    //           <td className={`cn1 ${item.TNTE > 0 && "cn_ap_color"}`}>
    //             {item.TNTE || 0}
    //           </td>
    //           <td
    //             className={`cn1 ${
    //               getValueServidor(item.nomenclatura, "TNTE") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "TNTE")}
    //           </td>
    //           <td
    //             className={`cn1 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "TNTE") || 0) -
    //                 (item.TNTE || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "TNTE") || 0) -
    //                     (item.TNTE || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "TNTE") || 0) -
    //               (item.TNTE || 0)}
    //           </td>

    //           <td className={`cn2 ${item.SBTE > 0 && "cn_ap_color"}`}>
    //             {item.SBTE || 0}
    //           </td>
    //           <td
    //             className={`cn2 ${
    //               getValueServidor(item.nomenclatura, "SBTE") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "SBTE")}
    //           </td>
    //           <td
    //             className={`cn2 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "SBTE") || 0) -
    //                 (item.SBTE || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "SBTE") || 0) -
    //                     (item.SBTE || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "SBTE") || 0) -
    //               (item.SBTE || 0)}
    //           </td>

    //           <td className={`cn1 ${item.SUBM > 0 && "cn_ap_color"}`}>
    //             {item.SUBM || 0}
    //           </td>
    //           <td
    //             className={`cn1 ${
    //               getValueServidor(item.nomenclatura, "SUBM") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "SUBM")}
    //           </td>
    //           <td
    //             className={`cn1 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "SUBM") || 0) -
    //                 (item.SUBM || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "SUBM") || 0) -
    //                     (item.SUBM || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "SUBM") || 0) -
    //               (item.SUBM || 0)}
    //           </td>

    //           <td className={`cn2 ${item.SUBP > 0 && "cn_ap_color"}`}>
    //             {item.SUBP || 0}
    //           </td>
    //           <td
    //             className={`cn2 ${
    //               getValueServidor(item.nomenclatura, "SUBP") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "SUBP")}
    //           </td>
    //           <td
    //             className={`cn2 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "SUBP") || 0) -
    //                 (item.SUBP || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "SUBP") || 0) -
    //                     (item.SUBP || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "SUBP") || 0) -
    //               (item.SUBP || 0)}
    //           </td>

    //           <td className={`cn1 ${item.SUBS > 0 && "cn_ap_color"}`}>
    //             {item.SUBS || 0}
    //           </td>
    //           <td
    //             className={`cn1 ${
    //               getValueServidor(item.nomenclatura, "SUBS") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "SUBS")}
    //           </td>
    //           <td
    //             className={`cn1 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "SUBS") || 0) -
    //                 (item.SUBS || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "SUBS") || 0) -
    //                     (item.SUBS || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "SUBS") || 0) -
    //               (item.SUBS || 0)}
    //           </td>

    //           <td className={`cn2 ${item.SGOP > 0 && "cn_ap_color"}`}>
    //             {item.SGOP || 0}
    //           </td>
    //           <td
    //             className={`cn2 ${
    //               getValueServidor(item.nomenclatura, "SGOP") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "SGOP")}
    //           </td>
    //           <td
    //             className={`cn2 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "SGOP") || 0) -
    //                 (item.SGOP || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "SGOP") || 0) -
    //                     (item.SGOP || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "SGOP") || 0) -
    //               (item.SGOP || 0)}
    //           </td>

    //           <td className={`cn1 ${item.SGOS > 0 && "cn_ap_color"}`}>
    //             {item.SGOS || 0}
    //           </td>
    //           <td
    //             className={`cn1 ${
    //               getValueServidor(item.nomenclatura, "SGOS") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "SGOS")}
    //           </td>
    //           <td
    //             className={`cn1 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "SGOS") || 0) -
    //                 (item.SGOS || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "SGOS") || 0) -
    //                     (item.SGOS || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "SGOS") || 0) -
    //               (item.SGOS || 0)}
    //           </td>

    //           <td className={`cn2 ${item.CBOP > 0 && "cn_ap_color"}`}>
    //             {item.CBOP || 0}
    //           </td>
    //           <td
    //             className={`cn2 ${
    //               getValueServidor(item.nomenclatura, "CBOP") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "CBOP")}
    //           </td>
    //           <td
    //             className={`cn2 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "CBOP") || 0) -
    //                 (item.CBOP || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "CBOP") || 0) -
    //                     (item.CBOP || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "CBOP") || 0) -
    //               (item.CBOP || 0)}
    //           </td>

    //           <td className={`cn1 ${item.CBOS > 0 && "cn_ap_color"}`}>
    //             {item.CBOS || 0}
    //           </td>
    //           <td
    //             className={`cn1 ${
    //               getValueServidor(item.nomenclatura, "CBOS") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "CBOS")}
    //           </td>
    //           <td
    //             className={`cn1 cn_ap_color ${
    //               (getValueServidor(item.nomenclatura, "CBOS") || 0) -
    //                 (item.CBOS || 0) >
    //               0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "CBOS") || 0) -
    //                     (item.CBOS || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "CBOS") || 0) -
    //               (item.CBOS || 0)}
    //           </td>

    //           <td className={`cn2 ${item.POLI > 0 && "cn_ap_color"}`}>
    //             {item.POLI || 0}
    //           </td>
    //           <td
    //             className={`cn2 ${
    //               getValueServidor(item.nomenclatura, "POLI") > 0 &&
    //               "cn_ap_color"
    //             }`}
    //           >
    //             {getValueServidor(item.nomenclatura, "POLI")}
    //           </td>
    //           <td
    //             className={`cn2 cn_ap_color ${
    //               getTotalForItemOrg(item) - getTotalForItemServ(item) > 0
    //                 ? "color_green"
    //                 : (getValueServidor(item.nomenclatura, "POLI") || 0) -
    //                     (item.POLI || 0) <
    //                   0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {(getValueServidor(item.nomenclatura, "POLI") || 0) -
    //               (item.POLI || 0)}
    //           </td>

    //           <td className="cn1 cn_ap_color">{getTotalForItemOrg(item)}</td>
    //           <td className="cn1 cn_ap_color">{getTotalForItemServ(item)}</td>
    //           <td
    //             className={`cn1 cn_ap_color ${
    //               getTotalForItemOrg(item) - getTotalForItemServ(item) > 0
    //                 ? "color_green"
    //                 : getTotalForItemOrg(item) - getTotalForItemServ(item) < 0
    //                 ? "color_red"
    //                 : "color_yellow"
    //             }`}
    //           >
    //             {getTotalForItemOrg(item) - getTotalForItemServ(item)}
    //           </td>
    //           <td className="vacio"></td>
    //         </tr>
    //       ))}
    //       <tr>
    //         <td className="total__table" rowSpan="2">
    //           TOTAL
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.GRAI || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.GRAI || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.GRAI || 0) - (totalesPorGradoOrg.GRAI || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.GRAD || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.GRAD || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.GRAD || 0) - (totalesPorGradoOrg.GRAD || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.CRNL || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.CRNL || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.CRNL || 0) - (totalesPorGradoOrg.CRNL || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.TCNL || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.TCNL || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.TCNL || 0) - (totalesPorGradoOrg.TCNL || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.MAYR || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.MAYR || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.MAYR || 0) - (totalesPorGradoOrg.MAYR || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.CPTN || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.CPTN || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.CPTN || 0) - (totalesPorGradoOrg.CPTN || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.TNTE || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.TNTE || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.TNTE || 0) - (totalesPorGradoOrg.TNTE || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.SBTE || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.SBTE || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.SBTE || 0) - (totalesPorGradoOrg.SBTE || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.SUBM || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.SUBM || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.SUBM || 0) - (totalesPorGradoOrg.SUBM || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.SUBP || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.SUBP || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.SUBP || 0) - (totalesPorGradoOrg.SUBP || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.SUBS || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.SUBS || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.SUBS || 0) - (totalesPorGradoOrg.SUBS || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.SGOP || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.SGOP || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.SGOP || 0) - (totalesPorGradoOrg.SGOP || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.SGOS || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.SGOS || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.SGOS || 0) - (totalesPorGradoOrg.SGOS || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.CBOP || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.CBOP || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.CBOP || 0) - (totalesPorGradoOrg.CBOP || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.CBOS || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.CBOS || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.CBOS || 0) - (totalesPorGradoOrg.CBOS || 0)}
    //         </td>
    //         <td className="tv1">{totalesPorGradoOrg.POLI || 0}</td>
    //         <td className="tv2">{totalesPorGradoServ.POLI || 0}</td>
    //         <td className="tv3">
    //           {(totalesPorGradoServ.POLI || 0) - (totalesPorGradoOrg.POLI || 0)}
    //         </td>
    //         <td className="tv1">{getTotalForItemOrg(totalesPorGradoOrg)}</td>
    //         <td className="tv2">
    //           {getTotalForItemServTotal(totalesPorGradoServ)}
    //         </td>
    //         <td className="tv3">
    //           {getTotalForItemServTotal(totalesPorGradoServ) -
    //             getTotalForItemOrg(totalesPorGradoOrg)}
    //         </td>
    //       </tr>
    //       <tr>
    //         <th colSpan="3">GRAI</th>
    //         <th colSpan="3">GRAD</th>
    //         <th colSpan="3">CRNL</th>
    //         <th colSpan="3">TCNL</th>
    //         <th colSpan="3">MAYR</th>
    //         <th colSpan="3">CPTN</th>
    //         <th colSpan="3">TNTE</th>
    //         <th colSpan="3">SBTE</th>
    //         <th colSpan="3">SUBM</th>
    //         <th colSpan="3">SUBP</th>
    //         <th colSpan="3">SUBS</th>
    //         <th colSpan="3">SGOP</th>
    //         <th colSpan="3">SGOS</th>
    //         <th colSpan="3">CBOP</th>
    //         <th colSpan="3">CBOS</th>
    //         <th colSpan="3">POLI</th>
    //         <th colSpan="3">TOTAL</th>
    //       </tr>
    //     </tbody>
    //   </table>
    // </div>

    <div>
      <h2 className="home_mesagge">TABLA DE DEFICIT O EXCESO</h2>
      <button onClick={exportToExcel}>Exportar a Excel</button>
      <button onClick={exportToPDF}>Exportar a PDF</button>
      <table id="tableRef" ref={tableRef}>
        <thead className="thead__organico">
          <tr>
            <th rowSpan={2} onClick={resetFilterAndSort}>
              NOMENCLATURA
            </th>
            <th colSpan="3">GRAI</th>
            <th colSpan="3">GRAD</th>
            <th colSpan="3">CRNL</th>
            <th colSpan="3">TCNL</th>
            <th colSpan="3">MAYR</th>
            <th colSpan="3">CPTN</th>
            <th colSpan="3">TNTE</th>
            <th colSpan="3">SBTE</th>
            <th colSpan="3">SUBM</th>
            <th colSpan="3">SUBP</th>
            <th colSpan="3">SUBS</th>
            <th colSpan="3">SGOP</th>
            <th colSpan="3">SGOS</th>
            <th colSpan="3">CBOP</th>
            <th colSpan="3">CBOS</th>
            <th colSpan="3">POLI</th>
            <th colSpan="3">TOTAL</th>
          </tr>
          <tr>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "GRAI")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "GRAI")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "GRAI")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "GRAD")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "GRAD")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "GRAD")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "CRNL")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "CRNL")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "CRNL")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "TCNL")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "TCNL")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "TCNL")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "MAYR")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "MAYR")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "MAYR")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "CPTN")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "CPTN")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "CPTN")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "TNTE")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "TNTE")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "TNTE")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "SBTE")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "SBTE")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "SBTE")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "SUBM")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "SUBM")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "SUBM")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "SUBP")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "SUBP")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "SUBP")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "SUBS")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "SUBS")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "SUBS")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "SGOP")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "SGOP")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "SGOP")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "SGOS")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "SGOS")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "SGOS")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "CBOP")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "CBOP")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "CBOP")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "CBOS")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "CBOS")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "CBOS")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort2("organico", "POLI")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort2("actual", "POLI")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort2("defExe", "POLI")}
            >
              Déficit / Exceso
            </th>
            <th
              className="texto__vertical tv1"
              onClick={() => handleSort("total")}
            >
              Aprobado
            </th>
            <th
              className="texto__vertical tv2"
              onClick={() => handleSort("total")}
            >
              Actual
            </th>
            <th
              className="texto__vertical tv3"
              onClick={() => handleSort("total")}
            >
              Déficit / Exceso
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedItems2.map((item) => (
            <tr key={item.nomenclatura}>
              <td className="nomenclatura">{item.nomenclatura}</td>

              <td className={`cn1 ${item.organico.GRAI > 0 && "cn_ap_color"}`}>
                {item.organico.GRAI || 0}
              </td>
              <td className={`cn1 ${item.actual.GRAI > 0 && "cn_ap_color"}`}>
                {item.actual.GRAI || 0}
              </td>
              <td
                className={`cn1 cn_ap_color ${
                  (item.defExe.GRAI || 0) > 0
                    ? "color_green"
                    : (item.defExe.GRAI || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.GRAI || 0}
              </td>

              <td className={`cn2 ${item.organico.GRAD > 0 && "cn_ap_color"}`}>
                {item.organico.GRAD || 0}
              </td>
              <td className={`cn2 ${item.actual.GRAD > 0 && "cn_ap_color"}`}>
                {item.actual.GRAD || 0}
              </td>
              <td
                className={`cn2 cn_ap_color ${
                  (item.defExe.GRAD || 0) > 0
                    ? "color_green"
                    : (item.defExe.GRAD || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.GRAD || 0}
              </td>

              <td className={`cn1 ${item.organico.CRNL > 0 && "cn_ap_color"}`}>
                {item.organico.CRNL || 0}
              </td>
              <td className={`cn1 ${item.actual.CRNL > 0 && "cn_ap_color"}`}>
                {item.actual.CRNL || 0}
              </td>
              <td
                className={`cn1 cn_ap_color ${
                  (item.defExe.CRNL || 0) > 0
                    ? "color_green"
                    : (item.defExe.CRNL || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.CRNL || 0}
              </td>

              <td className={`cn2 ${item.organico.TCNL > 0 && "cn_ap_color"}`}>
                {item.organico.TCNL || 0}
              </td>
              <td className={`cn2 ${item.actual.TCNL > 0 && "cn_ap_color"}`}>
                {item.actual.TCNL || 0}
              </td>
              <td
                className={`cn2 cn_ap_color ${
                  (item.defExe.TCNL || 0) > 0
                    ? "color_green"
                    : (item.defExe.TCNL || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.TCNL || 0}
              </td>

              <td className={`cn1 ${item.organico.MAYR > 0 && "cn_ap_color"}`}>
                {item.organico.MAYR || 0}
              </td>
              <td className={`cn1 ${item.actual.MAYR > 0 && "cn_ap_color"}`}>
                {item.actual.MAYR || 0}
              </td>
              <td
                className={`cn1 cn_ap_color ${
                  (item.defExe.MAYR || 0) > 0
                    ? "color_green"
                    : (item.defExe.MAYR || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.MAYR || 0}
              </td>

              <td className={`cn2 ${item.organico.CPTN > 0 && "cn_ap_color"}`}>
                {item.organico.CPTN || 0}
              </td>
              <td className={`cn2 ${item.actual.CPTN > 0 && "cn_ap_color"}`}>
                {item.actual.CPTN || 0}
              </td>
              <td
                className={`cn2 cn_ap_color ${
                  (item.defExe.CPTN || 0) > 0
                    ? "color_green"
                    : (item.defExe.CPTN || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.CPTN || 0}
              </td>

              <td className={`cn1 ${item.organico.TNTE > 0 && "cn_ap_color"}`}>
                {item.organico.TNTE || 0}
              </td>
              <td className={`cn1 ${item.actual.TNTE > 0 && "cn_ap_color"}`}>
                {item.actual.TNTE || 0}
              </td>
              <td
                className={`cn1 cn_ap_color ${
                  (item.defExe.TNTE || 0) > 0
                    ? "color_green"
                    : (item.defExe.TNTE || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.TNTE || 0}
              </td>

              <td className={`cn2 ${item.organico.SBTE > 0 && "cn_ap_color"}`}>
                {item.organico.SBTE || 0}
              </td>
              <td className={`cn2 ${item.actual.SBTE > 0 && "cn_ap_color"}`}>
                {item.actual.SBTE || 0}
              </td>
              <td
                className={`cn2 cn_ap_color ${
                  (item.defExe.SBTE || 0) > 0
                    ? "color_green"
                    : (item.defExe.SBTE || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.SBTE || 0}
              </td>

              <td className={`cn1 ${item.organico.SUBM > 0 && "cn_ap_color"}`}>
                {item.organico.SUBM || 0}
              </td>
              <td className={`cn1 ${item.actual.SUBM > 0 && "cn_ap_color"}`}>
                {item.actual.SUBM || 0}
              </td>
              <td
                className={`cn1 cn_ap_color ${
                  (item.defExe.SUBM || 0) > 0
                    ? "color_green"
                    : (item.defExe.SUBM || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.SUBM || 0}
              </td>

              <td className={`cn2 ${item.organico.SUBP > 0 && "cn_ap_color"}`}>
                {item.organico.SUBP || 0}
              </td>
              <td className={`cn2 ${item.actual.SUBP > 0 && "cn_ap_color"}`}>
                {item.actual.SUBP || 0}
              </td>
              <td
                className={`cn2 cn_ap_color ${
                  (item.defExe.SUBP || 0) > 0
                    ? "color_green"
                    : (item.defExe.SUBP || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.SUBP || 0}
              </td>

              <td className={`cn1 ${item.organico.SUBS > 0 && "cn_ap_color"}`}>
                {item.organico.SUBS || 0}
              </td>
              <td className={`cn1 ${item.actual.SUBS > 0 && "cn_ap_color"}`}>
                {item.actual.SUBS || 0}
              </td>
              <td
                className={`cn1 cn_ap_color ${
                  (item.defExe.SUBS || 0) > 0
                    ? "color_green"
                    : (item.defExe.SUBS || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.SUBS || 0}
              </td>

              <td className={`cn2 ${item.organico.SGOP > 0 && "cn_ap_color"}`}>
                {item.organico.SGOP || 0}
              </td>
              <td className={`cn2 ${item.actual.SGOP > 0 && "cn_ap_color"}`}>
                {item.actual.SGOP || 0}
              </td>
              <td
                className={`cn2 cn_ap_color ${
                  (item.defExe.SGOP || 0) > 0
                    ? "color_green"
                    : (item.defExe.SGOP || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.SGOP || 0}
              </td>

              <td className={`cn1 ${item.organico.SGOS > 0 && "cn_ap_color"}`}>
                {item.organico.SGOS || 0}
              </td>
              <td className={`cn1 ${item.actual.SGOS > 0 && "cn_ap_color"}`}>
                {item.actual.SGOS || 0}
              </td>
              <td
                className={`cn1 cn_ap_color ${
                  (item.defExe.SGOS || 0) > 0
                    ? "color_green"
                    : (item.defExe.SGOS || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.SGOS || 0}
              </td>

              <td className={`cn2 ${item.organico.CBOP > 0 && "cn_ap_color"}`}>
                {item.organico.CBOP || 0}
              </td>
              <td className={`cn2 ${item.actual.CBOP > 0 && "cn_ap_color"}`}>
                {item.actual.CBOP || 0}
              </td>
              <td
                className={`cn2 cn_ap_color ${
                  (item.defExe.CBOP || 0) > 0
                    ? "color_green"
                    : (item.defExe.CBOP || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.CBOP || 0}
              </td>

              <td className={`cn1 ${item.organico.CBOS > 0 && "cn_ap_color"}`}>
                {item.organico.CBOS || 0}
              </td>
              <td className={`cn1 ${item.actual.CBOS > 0 && "cn_ap_color"}`}>
                {item.actual.CBOS || 0}
              </td>
              <td
                className={`cn1 cn_ap_color ${
                  (item.defExe.CBOS || 0) > 0
                    ? "color_green"
                    : (item.defExe.CBOS || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.CBOS || 0}
              </td>

              <td className={`cn2 ${item.organico.POLI > 0 && "cn_ap_color"}`}>
                {item.organico.POLI || 0}
              </td>
              <td className={`cn2 ${item.actual.POLI > 0 && "cn_ap_color"}`}>
                {item.actual.POLI || 0}
              </td>
              <td
                className={`cn2 cn_ap_color ${
                  (item.defExe.POLI || 0) > 0
                    ? "color_green"
                    : (item.defExe.POLI || 0) < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {item.defExe.POLI || 0}
              </td>

              <td className="cn1 cn_ap_color">
                {getTotalForItem(item, "organico")}
              </td>
              <td className="cn1 cn_ap_color">
                {getTotalForItem(item, "actual")}
              </td>
              <td
                className={`cn1 cn_ap_color ${
                  getTotalForItem(item, "defExe") > 0
                    ? "color_green"
                    : getTotalForItem(item, "defExe") < 0
                    ? "color_red"
                    : "color_yellow"
                }`}
              >
                {getTotalForItem(item, "defExe")}
              </td>
              <td className="vacio"></td>
            </tr>
          ))}
          <tr>
            <td className="total__table" rowSpan="2">
              TOTAL
            </td>
            <td className="tv1">{totals.organico.GRAI || 0}</td>
            <td className="tv2">{totals.actual.GRAI || 0}</td>
            <td className="tv3">{totals.defExe.GRAI || 0}</td>

            <td className="tv1">{totals.organico.GRAD || 0}</td>
            <td className="tv2">{totals.actual.GRAD || 0}</td>
            <td className="tv3">{totals.defExe.GRAD || 0}</td>

            <td className="tv1">{totals.organico.CRNL || 0}</td>
            <td className="tv2">{totals.actual.CRNL || 0}</td>
            <td className="tv3">{totals.defExe.CRNL || 0}</td>

            <td className="tv1">{totals.organico.TCNL || 0}</td>
            <td className="tv2">{totals.actual.TCNL || 0}</td>
            <td className="tv3">{totals.defExe.TCNL || 0}</td>

            <td className="tv1">{totals.organico.MAYR || 0}</td>
            <td className="tv2">{totals.actual.MAYR || 0}</td>
            <td className="tv3">{totals.defExe.MAYR || 0}</td>

            <td className="tv1">{totals.organico.CPTN || 0}</td>
            <td className="tv2">{totals.actual.CPTN || 0}</td>
            <td className="tv3">{totals.defExe.CPTN || 0}</td>

            <td className="tv1">{totals.organico.TNTE || 0}</td>
            <td className="tv2">{totals.actual.TNTE || 0}</td>
            <td className="tv3">{totals.defExe.TNTE || 0}</td>

            <td className="tv1">{totals.organico.SBTE || 0}</td>
            <td className="tv2">{totals.actual.SBTE || 0}</td>
            <td className="tv3">{totals.defExe.SBTE || 0}</td>

            <td className="tv1">{totals.organico.SUBM || 0}</td>
            <td className="tv2">{totals.actual.SUBM || 0}</td>
            <td className="tv3">{totals.defExe.SUBM || 0}</td>

            <td className="tv1">{totals.organico.SUBP || 0}</td>
            <td className="tv2">{totals.actual.SUBP || 0}</td>
            <td className="tv3">{totals.defExe.SUBP || 0}</td>

            <td className="tv1">{totals.organico.SUBS || 0}</td>
            <td className="tv2">{totals.actual.SUBS || 0}</td>
            <td className="tv3">{totals.defExe.SUBS || 0}</td>

            <td className="tv1">{totals.organico.SGOP || 0}</td>
            <td className="tv2">{totals.actual.SGOP || 0}</td>
            <td className="tv3">{totals.defExe.SGOP || 0}</td>

            <td className="tv1">{totals.organico.SGOS || 0}</td>
            <td className="tv2">{totals.actual.SGOS || 0}</td>
            <td className="tv3">{totals.defExe.SGOS || 0}</td>

            <td className="tv1">{totals.organico.CBOP || 0}</td>
            <td className="tv2">{totals.actual.CBOP || 0}</td>
            <td className="tv3">{totals.defExe.CBOP || 0}</td>

            <td className="tv1">{totals.organico.CBOS || 0}</td>
            <td className="tv2">{totals.actual.CBOS || 0}</td>
            <td className="tv3">{totals.defExe.CBOS || 0}</td>

            <td className="tv1">{totals.organico.POLI || 0}</td>
            <td className="tv2">{totals.actual.POLI || 0}</td>
            <td className="tv3">{totals.defExe.POLI || 0}</td>

            <td className="tv1">{totals.organico.total || 0}</td>
            <td className="tv2">{totals.actual.total || 0}</td>
            <td className="tv3">{totals.defExe.total || 0}</td>
          </tr>
          <tr>
            <th colSpan="3">GRAI</th>
            <th colSpan="3">GRAD</th>
            <th colSpan="3">CRNL</th>
            <th colSpan="3">TCNL</th>
            <th colSpan="3">MAYR</th>
            <th colSpan="3">CPTN</th>
            <th colSpan="3">TNTE</th>
            <th colSpan="3">SBTE</th>
            <th colSpan="3">SUBM</th>
            <th colSpan="3">SUBP</th>
            <th colSpan="3">SUBS</th>
            <th colSpan="3">SGOP</th>
            <th colSpan="3">SGOS</th>
            <th colSpan="3">CBOP</th>
            <th colSpan="3">CBOS</th>
            <th colSpan="3">POLI</th>
            <th colSpan="3">TOTAL</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default TablaOrganico;
