import React, { useEffect } from "react";
import "./style/CardServidor.css";
import { Contactos } from "./Contactos";
import Titulos from "./Titulos";
import Pases from "./Pases";

const CardServidor = ({ servidor, hide, setHide }) => {
  const calcularTiempo = (fechaNacimiento) => {
    const fechaNacimientoObj = new Date(fechaNacimiento);
    const fechaActual = new Date();

    const años = fechaActual.getFullYear() - fechaNacimientoObj.getFullYear();
    const meses = fechaActual.getMonth() - fechaNacimientoObj.getMonth();
    const días = fechaActual.getDate() - fechaNacimientoObj.getDate();

    let edadAños = años;
    let edadMeses = meses;
    let edadDías = días;

    if (edadMeses < 0 || (edadMeses === 0 && edadDías < 0)) {
      edadAños--;
      edadMeses += 12;
    }

    if (edadDías < 0) {
      const mesAnterior = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth(),
        0
      );
      edadDías += mesAnterior.getDate();
      edadMeses--;
    }

    return `${edadAños} años, ${edadMeses} meses, ${edadDías} días`;
  };

  const edad = calcularTiempo(servidor.fechaNacimiento);
  const tiempoServicio = calcularTiempo(servidor.fechaIngreso);

  return (
    <div>
      <div className={`container__servidor ${hide && "card__close"}`}>
        <div className="card__servidor">
          <h2 className="title__servidor__card">
            Información del Servidor Policial
          </h2>
          <div
            onClick={() => {
              setHide(true);
            }}
            className="card__exit"
          >
            ❌
          </div>
          <section className="container__servidor__info__form">
            <section className="container__servidor__info">
              <h3>{servidor.id}</h3>
              <ul className="ul__servidor__info">
                <li>
                  <span>Grado: </span>
                  <span>grado</span>
                </li>
                <li>
                  <span>Nombres: </span>
                  <span>{servidor.nombres}</span>
                </li>
                <li>
                  <span>Apellidos: </span>
                  <span>{servidor.apellidos}</span>
                </li>
                <li>
                  <span>Pase Actual: </span>
                  <span>pase</span>
                </li>
                <li>
                  <span>Fecha de nacimiento: </span>
                  <span>{servidor.fechaNacimiento}</span>
                </li>
                <li>
                  <span>Edad: </span>
                  <span>{edad}</span>
                </li>
                <li>
                  <span>Fecha de ingreso a la Institución: </span>
                  <span>{tiempoServicio}</span>
                </li>
                <li>
                  <span>Provincia de Residencia: </span>
                  <span>{servidor.provinciaResidencia}</span>
                </li>
                <li>
                  <span>Cantón de Residencia: </span>
                  <span>{servidor.cantonResidencia}</span>
                </li>
                <li>
                  <span>Dirección domiciliaria: </span>
                  <span>{servidor.direccionResidencia}</span>
                </li>
                <li>
                  <span>Estado Civil: </span>
                  <span>{servidor.estadoCivil}</span>
                </li>
                <li>
                  <span>Etnia: </span>
                  <span>{servidor.etnia}</span>
                </li>
                <li>
                  <span>Es Acreditado: </span>
                  <span>{servidor.acreditado}</span>
                </li>
                <li>
                  <span>Alerta de Discapacidad: </span>
                  <span>{servidor.alertaDiscapacidad}</span>
                </li>
                <li>
                  <span>Tipo de Discapacidad: </span>
                  <span>{servidor.tipoDiscapacidad}</span>
                </li>
                <li>
                  <span>Porcentaje de Discapacidad: </span>
                  <span>{servidor.porcentajeDiscapacidad}</span>
                </li>
                <li>
                  <span>Detalle de discapacidad: </span>
                  <span>{servidor.detalleDiscapacidad}</span>
                </li>
                <li>
                  <span>Alerta de Enfermedad Catastrófica: </span>
                  <span>{servidor.alertaEnfermedadCatastrófica}</span>
                </li>
                <li>
                  <span>Detalle de Enfermedad Catastrófica: </span>
                  <span>{servidor.detalleEnfermedad}</span>
                </li>
              </ul>
            </section>
            <section className="container__servidor__form">
              <Contactos servidor={servidor} />
              <hr />
              <Titulos servidor={servidor} />
              <hr />
              <Pases servidor={servidor} />
            </section>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CardServidor;
