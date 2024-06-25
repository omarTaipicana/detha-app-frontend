import React from "react";
import { Link } from "react-router-dom";
import "./styles/PrincipalHeader.css";
import { useNavigate } from "react-router-dom";

const PrincipalHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.user ? localStorage.user : 0);
  const userRol = JSON.parse(localStorage.user ? localStorage.user : 0).rol;
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header>
      <section className="principal__header">
        <Link className="title__principal__header" to="/">
          <img
            className="img__header"
            src="https://res.cloudinary.com/deixskcku/image/upload/v1718293930/DIGIN-SF_z9vyuc.png"
            alt=""
          />
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
            {user ? `${user.firstName} ${user.lastName} ${user.rol}` : ""}
          </span>
          <button className="link__principal__header" onClick={handleLogout}>
            <img className="img__exit" src="../../../../exit.png" alt="" />
            Salir
          </button>
        </div>
      </section>
      <nav
        className="nav__principal"
        style={{
          display: user ? "flex" : "none",
        }}
      >
        <Link className="link__nav" to="/">
          Home
        </Link>
        <Link
          className="link__nav"
          to="/create_users"
          style={{
            display:
              userRol === "Sub-Administrador" ||
              userRol === "Administrador" ||
              userCI === "0503627234"
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
              userRol === "Administrador" || userCI === "0503627234"
                ? "flex"
                : "none",
          }}
        >
          Administradior
        </Link>
      </nav>
    </header>
  );
};

export default PrincipalHeader;
