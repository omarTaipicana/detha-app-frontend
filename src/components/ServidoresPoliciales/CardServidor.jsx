import React, { useEffect, useState } from "react";
import "./style/CardServidor.css";
import axios from "axios";
import getConfigToken from "../../services/getConfigToken";
import { Contactos } from "./Contactos";
import Titulos from "./Titulos";
import Pases from "./Pases";
import TipoDesplazamiento from "./TipoDesplazamiento";
import Ascenso from "./Ascenso";
import LicenciaConducir from "./LicenciaConducir";
import Novedades from "./Novedades";
import Capacitaciones from "./Capacitaciones";
import Tallas from "./Tallas";
import Funcion from "./Funcion";
import Vacaciones from "./Vacaciones";

const Seccion = ({ titulo, children, isOpen, toggleSection }) => {
  const prueba =
    !children.props.servidor.contactos?.length && titulo === "CONTACTOS";

  return (
    <div className="seccion">
      <div className="seccion-header" onClick={toggleSection}>
        <span
          style={{
            color: prueba ? "red" : "black",
          }}
          className="titulo__seccion"
        >
          {titulo}
        </span>
        <button className="toggle-button">{isOpen ? "-" : "+"}</button>
      </div>
      {isOpen && (
        <div className="seccion-content">
          <div className="table__container">{children}</div>
        </div>
      )}
    </div>
  );
};

const CardServidor = ({ servidor, hide, setHide }) => {
  const [desplazamientos, setDesplazamientos] = useState([]);
  const [updateDesplazamineto, setUpdateDesplazamineto] = useState(false);
  const urlBase = import.meta.env.VITE_API_URL;
  const [openSections, setOpenSections] = useState({
    pases: false,
    desplazamientos: false,
    novedades: false,
    vacaciones: false,
    ascensos: false,
    funcion: false,
    contactos: false,
    titulos: false,
    licencias: false,
    capacitaciones: false,
    tallas: false,
  });

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

  const toggleSection = (section) => {
    setOpenSections((estado) => ({ ...estado, [section]: !estado[section] }));
  };

  const closeAllSections = () => {
    setOpenSections({
      pases: false,
      desplazamientos: false,
      novedades: false,
      vacaciones: false,
      ascensos: false,
      funcion: false,
      contactos: false,
      titulos: false,
      licencias: false,
      capacitaciones: false,
      tallas: false,
    });
  };

  useEffect(() => {
    axios
      .get(`${urlBase}/desplazamientos`, getConfigToken())
      .then((res) => setDesplazamientos(res.data))
      .catch((err) => console.log(err));
  }, [updateDesplazamineto]);

  return (
    <div>
      <div className={`container__servidor ${hide && "card__close"}`}>
        <div className="imagen__fondo">
          <div className="card__servidor">
            <h2 className="title__servidor__card">
              Información del Servidor Policial
            </h2>
            <div
              onClick={() => {
                setHide(true);
                closeAllSections();
              }}
              className="card__exit"
            >
              ❌
            </div>
            <section className="container__servidor__info__form">
              <section className="container__servidor__card">
                <section className="container__servidor__info">
                  <ul className="ul__servidor__info">
                    <li className="li__servidor__info">
                      <span className="span__servidor">Nombres: </span>
                      <span className="span__servidor__info">
                        {servidor.nombres} {servidor.apellidos}
                      </span>
                    </li>
                    <li className="li__servidor__info">
                      <span className="span__servidor">Grado: </span>
                      <span className="span__servidor__info">
                        {servidor.ascensos && servidor.ascensos.length > 0
                          ? servidor.ascensos
                              .slice()
                              .sort(
                                (a, b) =>
                                  new Date(b.createdAt) - new Date(a.createdAt)
                              )[0].grado
                          : "SIN REGISTRO"}
                      </span>
                    </li>
                    <li className="li__servidor__info">
                      <span className="span__servidor">Cédula: </span>
                      <span className="span__servidor__info">
                        {servidor.cI}
                      </span>
                    </li>

                    <li className="li__servidor__info">
                      <span className="span__servidor">Pase Actual: </span>
                      <span className="span__servidor__info">
                        {servidor.pases && servidor.pases.length > 0
                          ? servidor.pases
                              .slice()
                              .sort(
                                (a, b) =>
                                  new Date(b.createdAt) - new Date(a.createdAt)
                              )[0].nomenclatura
                          : "SIN REGISTRO"}
                      </span>
                    </li>
                    <li className="li__servidor__info">
                      <span className="span__servidor">
                        Fecha de nacimiento:{" "}
                      </span>
                      <span className="span__servidor__info">
                        {servidor.fechaNacimiento}
                      </span>
                    </li>
                    <li className="li__servidor__info">
                      <span className="span__servidor">Edad: </span>
                      <span className="span__servidor__info">{edad}</span>
                    </li>
                    <li className="li__servidor__info">
                      <span className="span__servidor">
                        Ingreso a la PPNN:{" "}
                      </span>
                      <span className="span__servidor__info">
                        {servidor.fechaIngreso}
                      </span>
                    </li>

                    <li className="li__servidor__info">
                      <span className="span__servidor">
                        Tiempo en la Institución:{" "}
                      </span>
                      <span className="span__servidor__info">
                        {tiempoServicio}
                      </span>
                    </li>
                    <li className="li__servidor__info">
                      <span className="span__servidor">
                        Provincia de Residencia:{" "}
                      </span>
                      <span className="span__servidor__info">
                        {servidor.provinciaResidencia}
                      </span>
                    </li>
                    <li className="li__servidor__info">
                      <span className="span__servidor">
                        Cantón de Residencia:{" "}
                      </span>
                      <span className="span__servidor__info">
                        {servidor.cantonResidencia}
                      </span>
                    </li>
                    <li className="li__servidor__info">
                      <span className="span__servidor">
                        Dirección domiciliaria:{" "}
                      </span>
                      <span className="span__servidor__info">
                        {servidor.direccionResidencia}
                      </span>
                    </li>

                    <li className="li__servidor__info">
                      <span className="span__servidor">Estado Civil: </span>
                      <span className="span__servidor__info">
                        {servidor.estadoCivil}
                      </span>
                    </li>
                    <li className="li__servidor__info">
                      <span className="span__servidor">Etnia: </span>
                      <span className="span__servidor__info">
                        {servidor.etnia}
                      </span>
                    </li>
                    <li className="li__servidor__info">
                      <span className="span__servidor">Acreditado: </span>
                      <span className="span__servidor__info">
                        {servidor.acreditado}
                      </span>
                    </li>
                    <li className="li__servidor__info">
                      <span className="span__servidor">
                        Alerta de Discapacidad:{" "}
                      </span>
                      <span className="span__servidor__info">
                        {servidor.alertaDiscapacidad}
                      </span>
                    </li>

                    {servidor.alertaDiscapacidad === "SI" && (
                      <div className="div__hide">
                        <li className="li__servidor__info">
                          <span className="span__servidor">
                            Tipo de Discapacidad:{" "}
                          </span>
                          <span className="span__servidor__info">
                            {servidor.tipoDiscapacidad}
                          </span>
                        </li>
                        <li className="li__servidor__info">
                          <span className="span__servidor">
                            Porcentaje de Discapacidad:{" "}
                          </span>
                          <span className="span__servidor__info">
                            {servidor.porcentajeDiscapacidad}
                          </span>
                        </li>
                        <li className="li__servidor__info">
                          <span className="span__servidor">
                            Detalle de discapacidad:{" "}
                          </span>
                          <span className="span__servidor__info">
                            {servidor.detalleDiscapacidad}
                          </span>
                        </li>
                      </div>
                    )}

                    <li className="li__servidor__info">
                      <span className="span__servidor">
                        Alerta de Enf. Catastróf:{" "}
                      </span>
                      <span className="span__servidor__info">
                        {servidor.alertaEnfermedadCatastrofica}
                      </span>
                    </li>

                    {servidor.alertaEnfermedadCatastrofica === "SI" && (
                      <div className="div__hide">
                        <li className="li__servidor__info">
                          <span className="span__servidor">
                            Detalle de Enfermedad:{" "}
                          </span>
                          <span className="span__servidor__info">
                            {servidor.detalleEnfermedad}
                          </span>
                        </li>
                      </div>
                    )}
                  </ul>
                </section>
              </section>

              <section className="container__servidor__form">
                <div className="container-secciones">
                  <Seccion
                    titulo="PASES"
                    isOpen={openSections.pases}
                    toggleSection={() => toggleSection("pases")}
                  >
                    <Pases
                      servidor={servidor}
                      desplazamientos={desplazamientos}
                    />
                  </Seccion>

                  <Seccion
                    titulo="DESPLAZAMIENTOS"
                    isOpen={openSections.desplazamientos}
                    toggleSection={() => toggleSection("desplazamientos")}
                  >
                    <TipoDesplazamiento
                      servidor={servidor}
                      setUpdateDesplazamineto={setUpdateDesplazamineto}
                      updateDesplazamineto={updateDesplazamineto}
                    />
                  </Seccion>

                  <Seccion
                    titulo="NOVEDADES"
                    isOpen={openSections.novedades}
                    toggleSection={() => toggleSection("novedades")}
                  >
                    <Novedades
                      servidor={servidor}
                      desplazamientos={desplazamientos}
                    />
                  </Seccion>

                  <Seccion
                    titulo="VACACIONES"
                    isOpen={openSections.vacaciones}
                    toggleSection={() => toggleSection("vacaciones")}
                  >
                    <Vacaciones
                      servidor={servidor}
                      desplazamientos={desplazamientos}
                    />
                  </Seccion>

                  <Seccion
                    titulo="ASCENSOS"
                    isOpen={openSections.ascensos}
                    toggleSection={() => toggleSection("ascensos")}
                  >
                    <Ascenso
                      servidor={servidor}
                      desplazamientos={desplazamientos}
                    />
                  </Seccion>

                  <Seccion
                    titulo="FUNCIÓN ACTUAL"
                    isOpen={openSections.funcion}
                    toggleSection={() => toggleSection("funcion")}
                  >
                    <Funcion
                      servidor={servidor}
                      desplazamientos={desplazamientos}
                    />
                  </Seccion>

                  <Seccion
                    titulo="CONTACTOS"
                    isOpen={openSections.contactos}
                    toggleSection={() => toggleSection("contactos")}
                  >
                    <Contactos
                      servidor={servidor}
                      desplazamientos={desplazamientos}
                    />
                  </Seccion>

                  <Seccion
                    titulo="TÍTULOS"
                    isOpen={openSections.titulos}
                    toggleSection={() => toggleSection("titulos")}
                  >
                    <Titulos
                      servidor={servidor}
                      desplazamientos={desplazamientos}
                    />
                  </Seccion>

                  <Seccion
                    titulo="LICENCIAS DE CONDUCIR"
                    isOpen={openSections.licencias}
                    toggleSection={() => toggleSection("licencias")}
                  >
                    <LicenciaConducir
                      servidor={servidor}
                      desplazamientos={desplazamientos}
                    />
                  </Seccion>

                  <Seccion
                    titulo="CAPACITACIONES"
                    isOpen={openSections.capacitaciones}
                    toggleSection={() => toggleSection("capacitaciones")}
                  >
                    <Capacitaciones
                      servidor={servidor}
                      desplazamientos={desplazamientos}
                    />
                  </Seccion>

                  <Seccion
                    titulo="TALLAS"
                    isOpen={openSections.tallas}
                    toggleSection={() => toggleSection("tallas")}
                  >
                    <Tallas
                      servidor={servidor}
                      desplazamientos={desplazamientos}
                    />
                  </Seccion>
                </div>
              </section>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardServidor;
