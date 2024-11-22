import React, { useEffect, useState } from "react";
import "./style/DireccionUnidad.css";

const DireccionUnidad = ({
  direccion,
  delay,
  isLoading,
  setOrg,
  setServ,
  setDesp,
  show,
  setShow,
  handleClick,
  setLegalizado,
  setAprobado,
  organico,
  servidores,
  desplazamientos,
}) => {
  const [animatedAprobado, setAnimatedAprobado] = useState(0);
  const [animatedLegalizado, setAnimatedLegalizado] = useState(0);
  const [animatedDifference, setAnimatedDifference] = useState(0);

  const [animatedAprobadoDir, setAnimatedAprobadoDir] = useState(0);
  const [animatedLegalizadoDir, setAnimatedLegalizadoDir] = useState(0);
  const [animatedDifferenceDir, setAnimatedDifferenceDir] = useState(0);

  const [animatedAprobadoTo, setAnimatedAprobadoTo] = useState(0);
  const [animatedLegalizadoTo, setAnimatedLegalizadoTo] = useState(0);
  const [animatedDifferenceTo, setAnimatedDifferenceTo] = useState(0);

  const aprobado = organico.reduce(
    (acc, item) => {
      if (acc.grupos[item.grupoOcupacional]) {
        acc.grupos[item.grupoOcupacional] += item.total;
      } else {
        acc.grupos[item.grupoOcupacional] = item.total;
      }
      acc.totalGeneral += item.total;

      if (acc.grados[item.grado]) {
        acc.grados[item.grado] += item.total;
      } else {
        acc.grados[item.grado] = item.total;
      }

      return acc;
    },
    { grados: {}, grupos: {}, totalGeneral: 0 }
  );

  const legalizado = servidores.reduce(
    (acc, item) => {
      const ultimoAscenso = item.ascensos.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];

      if (ultimoAscenso) {
        const { grado } = ultimoAscenso;
        acc.grados[grado] = (acc.grados[grado] || 0) + 1;
        acc.totalGeneral += 1;
        const directivosGrados = [
          "GRAS",
          "GRAD",
          "GRAI",
          "CRNL",
          "TCNL",
          "MAYR",
          "CPTN",
          "TNTE",
          "SBTE",
        ];
        const grupo = directivosGrados.includes(grado)
          ? "Directivo"
          : "Técnico Operativo";
        acc.grupos[grupo] = (acc.grupos[grupo] || 0) + 1;
      }
      return acc;
    },
    { grados: {}, grupos: {}, totalGeneral: 0 }
  );

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setAnimatedAprobado(Math.floor(Math.random() * 100));
        setAnimatedLegalizado(Math.floor(Math.random() * 100));
        setAnimatedDifference(Math.floor(Math.random() * 100));

        setAnimatedAprobadoDir(Math.floor(Math.random() * 100));
        setAnimatedLegalizadoDir(Math.floor(Math.random() * 100));
        setAnimatedDifferenceDir(Math.floor(Math.random() * 100));

        setAnimatedAprobadoTo(Math.floor(Math.random() * 100));
        setAnimatedLegalizadoTo(Math.floor(Math.random() * 100));
        setAnimatedDifferenceTo(Math.floor(Math.random() * 100));
      }, 10);

      return () => clearInterval(interval);
    } else {
      setAnimatedAprobado(aprobado.totalGeneral);
      setAnimatedLegalizado(legalizado.totalGeneral);
      setAnimatedDifference(legalizado.totalGeneral - aprobado.totalGeneral);

      setAnimatedAprobadoDir(aprobado.grupos.Directivo);
      setAnimatedLegalizadoDir(legalizado.grupos.Directivo);
      setAnimatedDifferenceDir(
        legalizado.grupos.Directivo - aprobado.grupos.Directivo
      );

      setAnimatedAprobadoTo(aprobado.grupos["Técnico Operativo"]);
      setAnimatedLegalizadoTo(legalizado.grupos["Técnico Operativo"]);
      setAnimatedDifferenceTo(
        legalizado.grupos["Técnico Operativo"] -
          aprobado.grupos["Técnico Operativo"]
      );
    }
  }, [isLoading, aprobado.totalGeneral, legalizado.totalGeneral]);

  const handleContentClick = () => {
    handleClick();
    setOrg(organico);
    setServ(servidores);
    setDesp(desplazamientos);
    setLegalizado(legalizado);
    setAprobado(aprobado);
  };

  return (
    <div
      onClick={handleContentClick}
      className="direccion__content"
      style={{ animationDelay: `${delay}s` }}
    >
      <section>
        <span className="direccion__title"> {direccion.unidad}</span>
        <article className="direccion__info__content">
          <img
            className="imag__logo"
            src={`../../../logos/${direccion.unidad}.png`}
          />
          <section className="card__direccion__info">
            <ul className="card__direccion__ul">
              <li className="card__direccion__li">
                <span className="card__direccion__span blue__color">
                  APROBADO
                </span>
                <span className="card__direccion__span plomo__color">
                  LEGALIZADO
                </span>
                <span className="card__direccion__span green__color">
                  DÉFICIT
                </span>
              </li>
              <li className="card__direccion__li">
                <span className="card__direccion__span blue__color valor">
                  {animatedAprobado || 0}
                </span>
                <span className="card__direccion__span plomo__color valor">
                  {animatedLegalizado || 0}
                </span>
                <span className="card__direccion__span green__color valor">
                  {animatedDifference || 0}
                </span>
              </li>
            </ul>
            <span className="card__direccion__span__grupo">DIRECTIVO</span>
            <ul className="card__direccion__ul">
              <li className="card__direccion__li2">
                <span className="card__direccion__span blue__color valor2">
                  {animatedAprobadoDir || 0}
                </span>
                <span className="card__direccion__span plomo__color valor2">
                  {animatedLegalizadoDir || 0}
                </span>
                <span className="card__direccion__span green__color valor2">
                  {animatedDifferenceDir || 0}
                </span>
              </li>
            </ul>
            <span className="card__direccion__span__grupo">
              TÉCNICO OERATIVO
            </span>
            <ul className="card__direccion__ul">
              <li className="card__direccion__li2">
                <span className="card__direccion__span blue__color valor2">
                  {animatedAprobadoTo || 0}
                </span>
                <span className="card__direccion__span plomo__color valor2">
                  {animatedLegalizadoTo || 0}
                </span>
                <span className="card__direccion__span green__color valor2">
                  {animatedDifferenceTo || 0}
                </span>
              </li>
            </ul>
          </section>
        </article>
      </section>
    </div>
  );
};

export default DireccionUnidad;
