import React, { useEffect, useState } from "react";
import "./style/CardServidoresPoliciales.css";
import CardServidoresPoliciales from "./CardServidoresPoliciales";
import useCrud from "../../hooks/useCrud";
import CardServidor from "./CardServidor";
import IsLoading from "../shared/IsLoading";

const ServidoresPolicialesList = ({
  setFormIsClouse,
  formIsClouse,
  setServidorEdit,
  servidorEdit,
}) => {
  const user = JSON.parse(localStorage.user ? localStorage.user : 0);
  const [hide, setHide] = useState(true);
  const [servidorFilter, setServidorFilter] = useState([]);
  const [servidor, setServidor] = useState("");

  const [
    servidorPolicial,
    getApi,
    postApi,
    deleteApi,
    updateApi,
    hasError,
    isLoading,
  ] = useCrud();
  const PATH = "/servidores";

  useEffect(() => {
    getApi(PATH);
  }, [servidorEdit, formIsClouse, hide]);

  return (
    <div>
      {isLoading && <IsLoading />}
      <div className="card__servidorPolicial__content">
        {servidorPolicial
          ?.slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .filter((serv) => {
            const ultimoPase = serv.pases
              ?.slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

            if (serv.pases.length === 0) {
              return serv.usuarioRegistro === user.cI;
            }
            
            if (user.unidadSubzona === "Planta Administrativa DIGIN") {
              return serv.id;
            }

            if (user.unidadSubzona.slice(0, 21) === "Planta Administrativa") {
              return ultimoPase.direccion === user.direccion;
            }

            if (user.tipoDesignacion === "NOPERA") {
              return ultimoPase.unidad === user.unidad;
            }

            return (
              ultimoPase.unidadSubzona === user.unidadSubzona &&
              ultimoPase.unidad === user.unidad
            );
          })
          .map((servidorPolicial) => (
            <CardServidoresPoliciales
              key={servidorPolicial.id}
              servidorPolicial={servidorPolicial}
              setHide={setHide}
              setServidor={setServidor}
              setFormIsClouse={setFormIsClouse}
              setServidorEdit={setServidorEdit}
            />
          ))}
      </div>
      <CardServidor servidor={servidor} hide={hide} setHide={setHide} />
    </div>
  );
};

export default ServidoresPolicialesList;
