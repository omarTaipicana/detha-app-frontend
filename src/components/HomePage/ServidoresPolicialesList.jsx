import React, { useEffect } from "react";
import "./style/CardServidoresPoliciales.css";
import CardServidoresPoliciales from "./CardServidoresPoliciales";
import useCrud from "../../hooks/useCrud";

const ServidoresPolicialesList = () => {
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
  }, []);
  return (
    <div className="card__servidorPolicial__content">
      {servidorPolicial
        ?.slice()
        .reverse()
        .map((servidorPolicial) => (
          <CardServidoresPoliciales
            key={servidorPolicial.id}
            servidorPolicial={servidorPolicial}
          />
        ))}
    </div>
  );
};

export default ServidoresPolicialesList;
