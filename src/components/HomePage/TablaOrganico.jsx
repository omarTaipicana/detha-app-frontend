import React, { useEffect, useState } from "react";
import "./style/TablaOrganico.css";
import axios from "axios";
import getConfigToken from "../../services/getConfigToken";

const TablaOrganico = () => {
  const urlBase = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.user ? localStorage.user : 0);
  console.log(user);

  const [organicos, setOrganicos] = useState([]);

  useEffect(() => {
    axios
      .get(`${urlBase}/organicos`, getConfigToken())
      .then((res) => setOrganicos(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filteredOrganicos = organicos.filter(
    user.tipoDesignacion == "NOPERA"
      ? (org) => org.siglaUnidadGrupo === user.unidad
      : (org) =>
          org.unidadSubzona === user.unidadSubzona &&
          org.siglaUnidadGrupo === user.unidad
  );

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

  return (
    <div>
      <h2 className="home_mesagge">TABLA DE DEFICIT O EXCESO</h2>
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>NOMENCLATURA</th>
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
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
            <th className="texto__vertical tv1">Aprobado</th>
            <th className="texto__vertical tv2">Actual</th>
            <th className="texto__vertical tv3">Deficit / Exceso</th>
          </tr>
        </thead>
        <tbody>
          {objProcesado.map((item) => (
            <tr key={item.nomenclatura}>
              <td className="nomenclatura">{item.nomenclatura}</td>
              <td className="cn1">{item.GRAI || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className="cn2">{item.GRAD || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className="cn1">{item.CRNL || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className="cn2">{item.TCNL || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className="cn1">{item.MAYR || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className="cn2">{item.CPTN || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className="cn1">{item.TNTE || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className="cn2">{item.SBTE || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className="cn1">{item.SUBM || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className="cn2">{item.SUBP || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className="cn1">{item.SUBS || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className="cn2">{item.SGOP || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className="cn1">{item.SGOS || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className="cn2">{item.CBOP || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className="cn1">{item.CBOS || 0}</td>
              <td className="cn1">{0}</td>
              <td className="cn1">{0}</td>
              <td className="cn2">{item.POLI || 0}</td>
              <td className="cn2">{0}</td>
              <td className="cn2">{0}</td>
              <td className="cn1">
                {(item.GRAD ? item.GRAD : 0) +
                  (item.GRAI ? item.GRAI : 0) +
                  (item.CRNL ? item.CRNL : 0) +
                  (item.TCNL ? item.TCNL : 0) +
                  (item.MAYR ? item.MAYR : 0) +
                  (item.CPTN ? item.CPTN : 0) +
                  (item.TNTE ? item.TNTE : 0) +
                  (item.SBTE ? item.SBTE : 0) +
                  (item.SUBM ? item.SUBM : 0) +
                  (item.SUBP ? item.SUBP : 0) +
                  (item.SUBS ? item.SUBS : 0) +
                  (item.SGOP ? item.SGOP : 0) +
                  (item.SGOS ? item.SGOS : 0) +
                  (item.CBOP ? item.CBOP : 0) +
                  (item.CBOS ? item.CBOS : 0) +
                  (item.POLI ? item.POLI : 0)}
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
              {(totalesPorGrado.GRAI || 0) +
                (totalesPorGrado.GRAD || 0) +
                (totalesPorGrado.CRNL || 0) +
                (totalesPorGrado.TCNL || 0) +
                (totalesPorGrado.MAYR || 0) +
                (totalesPorGrado.CPTN || 0) +
                (totalesPorGrado.TNTE || 0) +
                (totalesPorGrado.SBTE || 0) +
                (totalesPorGrado.SUBM || 0) +
                (totalesPorGrado.SUBP || 0) +
                (totalesPorGrado.SUBS || 0) +
                (totalesPorGrado.SGOP || 0) +
                (totalesPorGrado.SGOS || 0) +
                (totalesPorGrado.CBOP || 0) +
                (totalesPorGrado.CBOS || 0) +
                (totalesPorGrado.POLI || 0)}
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
