import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/PrincipalHeader.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/states/alert.slice";
import Alert from "./Alert";
import useAuth from "../../hooks/useAuth";

const PrincipalHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, , , , , , , , , , , getUserLogged, user, setUserLogged] = useAuth();
  const userRol = user?.rol;
  const userCI = user?.cI;
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;
  const rolSubAdmin = import.meta.env.VITE_ROL_SUB_ADMIN;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      getUserLogged();
    }

    if (!token) {
      setUserLogged(null);
    }
  }, [token]);

  const handleLogout = () => {
    if (user) {
      dispatch(
        showAlert({
          message: `⚠️ Estimado ${user?.firstName} ${user?.lastName}, no olvides registrar las novedades`,
          alertType: 4,
        })
      );
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header>
      <section className="principal__header">
        <Link className="title__principal__header" to="/">
          <img className="img__header" src="../../../images/digin.png" alt="" />
          <div className="title__content">
            <h1 className="title__header">DIGIN</h1>
            <span className="title__span__header">
              Dirección General de Investigación
            </span>
          </div>
        </Link>

        <div className="greeting__principal__header">
          <span className="greeting__text">
            {user ? `Saludos Cordiales ` : ""}
          </span>
          <span className="greeting__text">
            {user ? `${user.firstName} ${user.lastName}` : ""}
          </span>
          <span className="greeting__text">{user ? `${user.rol}` : ""}</span>
          <span className="greeting__text">
            {user ? `${user.unidad} - ${user.unidadSubzona}` : ""}
          </span>
          <button
            style={{
              display: token ? "flex" : "none",
            }}
            className="link__principal__header"
            onClick={handleLogout}
          >
            <img className="img__exit" src="../../../../exit.png" alt="" />
            Salir
          </button>
        </div>
      </section>
      <nav
        className="nav__principal"
        style={{
          display: token ? "flex" : "none",
        }}
      >
        <Link className="link__nav" to="/">
          Home
        </Link>
        <Link className="link__nav" to="/servidores">
          Servidores Policiales
        </Link>
        <Link className="link__nav" to="/partediario">
          Parte Diario
        </Link>
        <Link
          className="link__nav"
          to="/create_users"
          style={{
            display:
              userRol === rolSubAdmin ||
              userRol === rolAdmin ||
              userCI === superAdmin
                ? "flex"
                : "none",
          }}
        >
          Gestionar Usuarios
        </Link>
        <Link
          className="link__nav"
          to="/admin"
          style={{
            display:
              userRol === rolAdmin || userCI === superAdmin ? "flex" : "none",
          }}
        >
          Administradior
        </Link>
      </nav>
      <Alert />
    </header>
  );
};

export default PrincipalHeader;
