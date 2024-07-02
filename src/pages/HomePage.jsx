import React, { useEffect, useState } from "react";
import "./styles/HomePage.css";
import axios from "axios";

import FromServidorP from "../components/HomePage/FromServidorP";
import getConfigToken from "../services/getConfigToken";
const HomePage = () => {
  const urlBase = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.user ? localStorage.user : 0);

  const [organicos, setOrganicos] = useState([]);

  useEffect(() => {
    axios
      .get(`${urlBase}/organicos`, getConfigToken())
      .then((res) => setOrganicos(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filteredOrganicos = organicos.filter(
    (org) => org.siglaUnidadGrupo === user.unidad
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
      <h2 className="home_mesagge">
        SISTEMA DE TALENTO HUMANO DE LA DIGIN EN DESARROLLO
      </h2>
      <FromServidorP />
      <table>
        <thead>
          <tr>
            <th>Nomenclatura</th>
            <th>GRAI</th>
            <th>GRAD</th>
            <th>CRNL</th>
            <th>TCNL</th>
            <th>MAYR</th>
            <th>CPTN</th>
            <th>TNTE</th>
            <th>SBTE</th>
            <th>SUBM</th>
            <th>SUBP</th>
            <th>SUBS</th>
            <th>SGOP</th>
            <th>SGOS</th>
            <th>CBOP</th>
            <th>CBOS</th>
            <th>POLI</th>
            <th>Total:</th>
          </tr>
        </thead>
        <tbody>
          {objProcesado.map((item) => (
            <tr key={item.nomenclatura}>
              <td className="nomenclatura">{item.nomenclatura}</td>
              <td>{item.GRAI || 0}</td>
              <td>{item.GRAD || 0}</td>
              <td>{item.CRNL || 0}</td>
              <td>{item.TCNL || 0}</td>
              <td>{item.MAYR || 0}</td>
              <td>{item.CPTN || 0}</td>
              <td>{item.TNTE || 0}</td>
              <td>{item.SBTE || 0}</td>
              <td>{item.SUBM || 0}</td>
              <td>{item.SUBP || 0}</td>
              <td>{item.SUBS || 0}</td>
              <td>{item.SGOP || 0}</td>
              <td>{item.SGOS || 0}</td>
              <td>{item.CBOP || 0}</td>
              <td>{item.CBOS || 0}</td>
              <td>{item.POLI || 0}</td>
              <td>
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
            </tr>
          ))}
          <tr>
            <td>Total:</td>
            <td>{totalesPorGrado.GRAI || 0}</td>
            <td>{totalesPorGrado.GRAD || 0}</td>
            <td>{totalesPorGrado.CRNL || 0}</td>
            <td>{totalesPorGrado.TCNL || 0}</td>
            <td>{totalesPorGrado.MAYR || 0}</td>
            <td>{totalesPorGrado.CPTN || 0}</td>
            <td>{totalesPorGrado.TNTE || 0}</td>
            <td>{totalesPorGrado.SBTE || 0}</td>
            <td>{totalesPorGrado.SUBM || 0}</td>
            <td>{totalesPorGrado.SUBP || 0}</td>
            <td>{totalesPorGrado.SUBS || 0}</td>
            <td>{totalesPorGrado.SGOP || 0}</td>
            <td>{totalesPorGrado.SGOS || 0}</td>
            <td>{totalesPorGrado.CBOP || 0}</td>
            <td>{totalesPorGrado.CBOS || 0}</td>
            <td>{totalesPorGrado.POLI || 0}</td>
            <td>
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
          </tr>
          <tr>
            <th>Nomenclatura</th>
            <th>GRAI</th>
            <th>GRAD</th>
            <th>CRNL</th>
            <th>TCNL</th>
            <th>MAYR</th>
            <th>CPTN</th>
            <th>TNTE</th>
            <th>SBTE</th>
            <th>SUBM</th>
            <th>SUBP</th>
            <th>SUBS</th>
            <th>SGOP</th>
            <th>SGOS</th>
            <th>CBOP</th>
            <th>CBOS</th>
            <th>POLI</th>
            <th>TOTAL</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HomePage;
