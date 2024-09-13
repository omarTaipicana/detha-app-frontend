import React from "react";
import "./styles/IsLoading.css";

const IsLoading = () => {
  return (
    <div className="isLoading">
      <img className="img__loading" src="../../../../loading.gif" alt="" />
      <span className="text__loading">cargando...</span>
    </div>
  );
};

export default IsLoading;
