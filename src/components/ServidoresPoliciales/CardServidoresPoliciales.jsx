import React, { useEffect, useState } from "react";
import "./style/CardServidoresPoliciales.css";
import useCrud from "../../hooks/useCrud";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/states/alert.slice";

const CardServidoresPoliciales = ({
  servidorPolicial,
  setHide,
  setServidor,
  setServidorEdit,
  setFormIsClouse,
  setUpdatedelete,
  updatedelete,
}) => {
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const PATH_SERVIDORES = "/servidores";
  const dispatch = useDispatch();

  const userLoggued = JSON.parse(localStorage.user ? localStorage.user : 0);
  const [hideDelete, setHideDelete] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [
    response,
    getServ,
    postServ,
    deleteServ,
    updateServ,
    error,
    isLoading,
    newReg,
    deleteReg,
    updateReg,
  ] = useCrud();

  useEffect(() => {
    if (error) {
      dispatch(
        showAlert({
          message: `⚠️ ${error.response?.data?.message}` || "Error inesperado",
          alertType: 1,
        })
      );
    }
  }, [error]);

  useEffect(() => {
    if (deleteReg) {
      dispatch(
        showAlert({
          message:
            `⚠️ Se elimino al Servidor Policial ${deleteReg.nombres} ${deleteReg.apellidos}` ||
            "Error inesperado",
          alertType: 4,
        })
      );
      setUpdatedelete(!updatedelete);
    }
  }, [deleteReg]);

  const handleInfoServidorPolicial = () => {
    setServidor(servidorPolicial);
    setHide(false);
  };

  const handleEditServidorPolicial = () => {
    setFormIsClouse(false);
    setServidorEdit(servidorPolicial);
  };

  const handleHideDelete = () => {
    setHideDelete(false);
  };

  const handleDelete = () => {
    setHideDelete(true);
    deleteServ(PATH_SERVIDORES, servidorPolicial.id);
  };

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const desplazamientoVigente = servidorPolicial?.desplazamientos
    ?.filter((desplazamiento) => !desplazamiento.fechaFinalización)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  const ultimoPase = servidorPolicial?.pases?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )[0];

  const getAlertColor = () => {
    switch (desplazamientoVigente?.tipoDesplazamiento) {
      case "TRASLADO TEMPORAL":
        return "var(--redT-color)";
      case "TRASLADO EVENTUAL":
        return "var(--orangeT-color)";
      case "COMISIÓN OCASIONAL":
        return "var(--greenT-color)";
      case "COMISIÓN AL EXTERIOR":
        return "var(--blueT-color)";
      case "DISPOSICIÓN VERBAL":
        return "var(--yellowT-color)";
      case "OTROS":
        return "var(--yellowT-color)";
      default:
        return "var(--plomoT-color)";
    }
  };

  const direccion =
    desplazamientoVigente &&
    (userLoggued.unidadSubzona === "Planta Administrativa DIGIN" &&
    desplazamientoVigente?.direccion === "OTROS"
      ? "der"
      : userLoggued.unidadSubzona === "Planta Administrativa DIGIN" &&
        desplazamientoVigente?.direccion !== "OTROS"
      ? undefined
      : userLoggued.tipoDesignacion === "NOPERA" &&
        userLoggued.direccion === desplazamientoVigente?.direccion &&
        userLoggued.direccion !== ultimoPase?.direccion &&
        userLoggued.unidad !== ultimoPase?.unidad &&
        userLoggued.unidadSubzona !== desplazamientoVigente?.unidadSubzona
      ? "izq"
      : userLoggued.tipoDesignacion === "NOPERA" &&
        userLoggued.direccion === desplazamientoVigente?.direccion &&
        userLoggued.unidad !== desplazamientoVigente?.unidad &&
        userLoggued.unidadSubzona !== desplazamientoVigente?.unidadSubzona
      ? undefined
      : userLoggued.tipoDesignacion === "NOPERA" &&
        userLoggued.unidad === desplazamientoVigente?.unidad &&
        userLoggued.unidad !== ultimoPase?.unidad &&
        userLoggued.unidadSubzona !== desplazamientoVigente?.unidadSubzona
      ? "izq"
      : userLoggued.tipoDesignacion === "NOPERA" &&
        userLoggued.unidad === desplazamientoVigente?.unidad &&
        userLoggued.unidadSubzona !== desplazamientoVigente?.unidadSubzona
      ? undefined
      : userLoggued.tipoDesignacion === "NOPERA" &&
        userLoggued.unidad !== desplazamientoVigente?.unidad
      ? "der"
      : userLoggued.tipoDesignacion === "NOPERA" &&
        userLoggued.unidad !== desplazamientoVigente?.unidad &&
        userLoggued.direccion !== desplazamientoVigente?.direccion
      ? "izq"
      : userLoggued.tipoDesignacion === "NOPERA" &&
        userLoggued.unidad === desplazamientoVigente?.unidad
      ? "izq"
      : userLoggued.unidadSubzona === desplazamientoVigente?.unidadSubzona &&
        userLoggued.unidad !== desplazamientoVigente?.unidad
      ? "der"
      : userLoggued.unidadSubzona !== desplazamientoVigente?.unidadSubzona
      ? "der"
      : "izq");

  return (
    <div
      style={{
        backgroundColor:
          ultimoPase?.direccion === "OTROS" ? "#c2fec7" : "transparent",
      }}
      className="card__servidorPolicial"
    >
      <div className="card__servidorPolicial__li__img">
        <div
          className="alert__desplazamiento"
          style={{ backgroundColor: getAlertColor() }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {direccion && (
            <img
              onClick={handleEditServidorPolicial}
              src={`../../../${direccion}.png`}
              alt=""
            />
          )}
          {showTooltip &&
            desplazamientoVigente &&
            (direccion === "der" || direccion === undefined ? (
              <div className="tooltip">
                <ul className="ul__tooltip">
                  <li className="li__tooltip">
                    <span className="label__tooltip">DESPLAZAMIENTO: </span>
                    <span className="value__tooltip">
                      {desplazamientoVigente.tipoDesplazamiento}
                    </span>
                  </li>
                  <li className="li__tooltip">
                    <span className="label__tooltip">DIRECCIÓN: </span>
                    <span className="value__tooltip">
                      {desplazamientoVigente.direccion}
                    </span>
                  </li>
                  <li className="li__tooltip">
                    <span className="label__tooltip">UNIDAD: </span>
                    <span className="value__tooltip">
                      {desplazamientoVigente.unidad}
                    </span>
                  </li>
                  <li className="li__tooltip">
                    <span className="label__tooltip">SUBZONA: </span>
                    <span className="value__tooltip">
                      {desplazamientoVigente.unidadSubzona}
                    </span>
                  </li>
                  <li className="li__tooltip">
                    <span className="label__tooltip">PROVINCIA DESP: </span>
                    <span className="value__tooltip">
                      {desplazamientoVigente.provinciaDesplazamiento}
                    </span>
                  </li>
                  <li className="li__tooltip">
                    <span className="label__tooltip">CANTON DESP: </span>
                    <span className="value__tooltip">
                      {desplazamientoVigente.cantonDesplazamiento}
                    </span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="tooltip">
                <ul className="ul__tooltip">
                  <li className="li__tooltip">
                    <span className="label__tooltip">DESPLAZAMIENTO: </span>
                    <span className="value__tooltip">
                      {desplazamientoVigente.tipoDesplazamiento}
                    </span>
                  </li>
                  <li className="li__tooltip">
                    <span className="label__tooltip">DIRECC. ORIGEN: </span>
                    <span className="value__tooltip">
                      {ultimoPase.direccion}
                    </span>
                  </li>
                  <li className="li__tooltip">
                    <span className="label__tooltip">UNIDAD ORIGEN: </span>
                    <span className="value__tooltip">{ultimoPase.unidad}</span>
                  </li>
                  <li className="li__tooltip">
                    <span className="label__tooltip">SUBZONA ORIGEN: </span>
                    <span className="value__tooltip">
                      {ultimoPase.unidadSubzona}
                    </span>
                  </li>
                </ul>
              </div>
            ))}
        </div>

        <img
          className="btn__expand"
          onClick={handleEditServidorPolicial}
          src="../../../edit.png"
          alt=""
        />
        {userLoggued.cI === superAdmin && (
          <img
            onClick={handleHideDelete}
            className="btn__expand"
            src="../../../delete.png"
            alt=""
          />
        )}
      </div>
      <ul
        className="card__servidorPolicial__ul"
        onClick={handleInfoServidorPolicial}
      >
        <li className="card__servidorPolicial__li">
          <span className="card__servidorPolicial__label">UNIDAD: </span>
          <span
            className="card__servidorPolicial__value"
            style={{
              color: servidorPolicial?.pases.length === 0 ? "red" : "inherit",
              fontWeight:
                servidorPolicial.pases.length === 0 ? "800" : "inherit",
              fontSize:
                servidorPolicial.pases.length === 0 ? "0.7em" : "inherit",
            }}
          >
            {servidorPolicial.pases.length === 0
              ? "SIN REGISTRO"
              : `${
                  servidorPolicial.pases.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  )[0]?.unidadSubzona || ""
                } / ${
                  servidorPolicial.pases.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  )[0]?.unidad || ""
                }`}
          </span>
        </li>

        <li className="card__servidorPolicial__li__grado">
          <span className="card__servidorPolicial__label">GRADO: </span>
          <span
            className="card__servidorPolicial__value"
            style={{
              color: servidorPolicial.ascensos.length === 0 ? "red" : "inherit",
              fontWeight:
                servidorPolicial.ascensos.length === 0 ? "800" : "inherit",
              fontSize:
                servidorPolicial.ascensos.length === 0 ? "0.7em" : "inherit",
            }}
          >
            {servidorPolicial.ascensos.length === 0
              ? "SIN REGISTRO"
              : `${
                  servidorPolicial.ascensos.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  )[0]?.grado || ""
                }`}
          </span>
        </li>

        <li className="card__servidorPolicial__li">
          <span className="card__servidorPolicial__label">CEDULA: </span>
          <span className="card__servidorPolicial__value">
            {servidorPolicial.cI}
          </span>
        </li>
        <li className="card__servidorPolicial__li">
          <span className="card__servidorPolicial__label">NOMBRES: </span>
          <span className="card__servidorPolicial__value">
            {servidorPolicial.nombres}
          </span>
        </li>
        <li className="card__servidorPolicial__li">
          <span className="card__servidorPolicial__label">APELLIDOS: </span>
          <span className="card__servidorPolicial__value">
            {servidorPolicial.apellidos}
          </span>
        </li>
      </ul>
      <section
        className={`container__delete__user ${
          hideDelete && "container__delete__user__close"
        }`}
      >
        <div className="form__delete">
          <span className="delete__serv">
            Esta seguro de eliminar el Registro
          </span>
          <div className="btn__delete__serv__content">
            <button onClick={handleDelete} className="btn__delete">
              SI
            </button>
            <button onClick={() => setHideDelete(true)} className="btn__delete">
              NO
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CardServidoresPoliciales;
