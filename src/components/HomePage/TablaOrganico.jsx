import React, { useEffect, useRef, useState } from "react";
import "./style/TablaOrganico.css";
import axios from "axios";
import getConfigToken from "../../services/getConfigToken";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import domtoimage from 'dom-to-image';

const TablaOrganico = () => {
  const urlBase = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.user ? localStorage.user : 0);

  const [organicos, setOrganicos] = useState([]);
  const [filteredOrganicos, setFilteredOrganicos] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    axios
      .get(`${urlBase}/organicos`, getConfigToken())
      .then((res) => {
        setOrganicos(res.data)
        filterOrganicos(res.data)
      })
      .catch((err) => console.log(err));
       }, []);

  const filterOrganicos = (organicos) => {
    const filtered = organicos.filter(
      user.tipoDesignacion === "NOPERA"
        ? (org) => org.siglaUnidadGrupo === user.unidad
        : (org) =>
            org.unidadSubzona === user.unidadSubzona &&
            org.siglaUnidadGrupo === user.unidad
    );
    setFilteredOrganicos(filtered);
  };

  const processOrgnaicos = () => {  

    const objProcesado = {};
    filteredOrganicos.forEach((item) => {
      const { nomenclatura, grado, total } = item;
      if (!objProcesado[nomenclatura]) {
        objProcesado[nomenclatura] = { nomenclatura, [grado]: total };
      } else {
        if (!objProcesado[nomenclatura][grado]) {
          objProcesado[nomenclatura][grado] = total;
        } else {
          objProcesado[nomenclatura][grado] += total;
        }
      }
    });
    const dataArray = Object.values(objProcesado);
    return dataArray;
  };
  const objProcesado = processOrgnaicos();

  const totalesPorGrado = filteredOrganicos.reduce((acc, item) => {
    const { grado, total } = item;
    if (!acc[grado]) {
      acc[grado] = 0;
    }
    acc[grado] += total;
    return acc;
  }, {});
  
  const getTotalForItem = (item) => {
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

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = [...objProcesado].sort((a, b) => {
    if (sortConfig.key) {
      const directionMultiplier = sortConfig.direction === 'asc' ? 1 : -1;
      if (sortConfig.key === 'total') {
        return directionMultiplier * (getTotalForItem(a) - getTotalForItem(b));
      } else {
        return directionMultiplier * ((a[sortConfig.key] || 0) - (b[sortConfig.key] || 0));
      }
    }
    return 0;
  });

  
  // const exportToExcel = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(sortedItems);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Organicos");
  //   const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  //   const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  //   saveAs(data, "TablaOrganicos.xlsx");
  // };
  const tableRef = useRef(null);
  
  const exportToPDF = () => {
    const node = document.getElementById('tableRef');  
    const scale = 2;   
    domtoimage.toPng(node, {
      width: node.scrollWidth * scale,
      height: node.scrollHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${node.scrollWidth}px`,
        height: `${node.scrollHeight}px`,
        left: '-200px' 
      }
    })
    .then((dataUrl) => {
      const img = new Image();
      img.src = dataUrl;
  
      img.onload = () => {
        const doc = new jsPDF('l', 'mm', 'a4'); 
        const imgWidth = 280; 
        const imgHeight = img.height * imgWidth / img.width; 
  
        doc.addImage(img, 'PNG', 10, 10, imgWidth, imgHeight);
        doc.save('TablaOrganicos.pdf');
      };
    })
    .catch((error) => {
      console.error('Error al generar la imagen:', error);
    });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.table_to_sheet(tableRef.current);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table.xlsx');
  };

  const resetFilterAndSort = () => {
    filterOrganicos(organicos);
    setSortConfig({ key: null, direction: 'asc' });
  };

  return (
    <div>
      <h2 className="home_mesagge">TABLA DE DEFICIT O EXCESO</h2>
      <button onClick={exportToExcel}>Exportar a Excel</button>
      <button onClick={exportToPDF}>Exportar a PDF</button>
      <table id="tableRef" ref={tableRef}>
        <thead>
          <tr>
            <th rowSpan={2} onClick={resetFilterAndSort}>NOMENCLATURA</th>
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
            <th className="texto__vertical tv1" onClick={() => handleSort('GRAI')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('GRAI')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('GRAI')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('GRAD')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('GRAD')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('GRAD')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('CRNL')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('CRNL')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('CRNL')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('TCNL')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('TCNL')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('TCNL')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('MAYR')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('MAYR')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('MAYR')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('CPTN')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('CPTN')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('CPTN')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('TNTE')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('TNTE')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('TNTE')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('SBTE')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('SBTE')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('SBTE')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('SUBM')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('SUBM')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('SUBM')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('SUBP')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('SUBP')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('SUBP')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('SUBS')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('SUBS')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('SUBS')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('SGOP')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('SGOP')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('SGOP')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('SGOS')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('SGOS')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('SGOS')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('CBOP')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('CBOP')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('CBOP')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('CBOS')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('CBOS')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('CBOS')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('POLI')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('POLI')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('POLI')}>Déficit / Exceso</th>
            <th className="texto__vertical tv1" onClick={() => handleSort('total')}>Aprobado</th>
            <th className="texto__vertical tv2" onClick={() => handleSort('total')}>Actual</th>
            <th className="texto__vertical tv3" onClick={() => handleSort('total')}>Déficit / Exceso</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr key={item.nomenclatura}>
              <td className="nomenclatura">{item.nomenclatura}</td>
              <td className={`cn1 ${item.GRAI > 0 && "cn_ap_color"}`}>{item.GRAI || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className={`cn2 ${item.GRAD > 0 && "cn_ap_color"}`}>{item.GRAD || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className={`cn1 ${item.CRNL > 0 && "cn_ap_color"}`}>{item.CRNL || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className={`cn2 ${item.TCNL > 0 && "cn_ap_color"}`}>{item.TCNL || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className={`cn1 ${item.MAYR > 0 && "cn_ap_color"}`}>{item.MAYR || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className={`cn2 ${item.CPTN > 0 && "cn_ap_color"}`}>{item.CPTN || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className={`cn1 ${item.TNTE > 0 && "cn_ap_color"}`}>{item.TNTE || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className={`cn2 ${item.SBTE > 0 && "cn_ap_color"}`}>{item.SBTE || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className={`cn1 ${item.SUBM > 0 && "cn_ap_color"}`}>{item.SUBM || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className={`cn2 ${item.SUBP > 0 && "cn_ap_color"}`}>{item.SUBP || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className={`cn1 ${item.SUBS > 0 && "cn_ap_color"}`}>{item.SUBS || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className={`cn2 ${item.SGOP > 0 && "cn_ap_color"}`}>{item.SGOP || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className={`cn1 ${item.SGOS > 0 && "cn_ap_color"}`}>{item.SGOS || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className={`cn2 ${item.CBOP > 0 && "cn_ap_color"}`}>{item.CBOP || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className={`cn1 ${item.CBOS > 0 && "cn_ap_color"}`}>{item.CBOS || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className={`cn2 ${item.POLI > 0 && "cn_ap_color"}`}>{item.POLI || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className={`cn1 ${ "cn_ap_color"}`}>
                {getTotalForItem(item)}
              </td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
            </tr>
          ))}
          <tr>
            <td className="total__table" rowSpan="2">
              TOTAL
            </td>
            <td className="tv1">{totalesPorGrado.GRAI || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.GRAD || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.CRNL || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.TCNL || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.MAYR || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.CPTN || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.TNTE || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.SBTE || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.SUBM || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.SUBP || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.SUBS || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.SGOP || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.SGOS || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.CBOP || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.CBOS || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">{totalesPorGrado.POLI || 0}</td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
            <td className="tv1">
              {getTotalForItem(totalesPorGrado)}
            </td>
            <td className="tv2">{0}</td>
            <td className="tv3">{0}</td>
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
