import React from "react";
import "./styles/InactivePage.css";

const InactivePage = () => {
  return (
    <div>
      <section className="inactive__content">
        <h3 className="inactive__title">Usuario Deshabilitado</h3>
        <span className="inactive__message">
          Su usuario se encuentra deshabilitado, para que se realize la
          habilitación de su usuario contactese con el Administrador
        </span>
        <a
          className="inactive__mail"
          href="mailto:digindesarrollo@gmail.com?subject=Solicitud%20de%20activación%20de%20usuario&body=Remito%20el%20presente%20con%20el%20fin%20de%20solicitar%20la%20activación%20de%20mi%20usuario.%0D%0AInformación%20de%20mi%20usuario:%0D%0ACedula:%0D%0AGrado:%0D%0ANombres:%0D%0AApellidos:%0D%0AObservación:"
        >
          Enviar correo electrónico
        </a>
      </section>
    </div>
  );
};

export default InactivePage;
