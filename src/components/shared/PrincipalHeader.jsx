import React from "react";
import { Link } from "react-router-dom";
import "./styles/PrincipalHeader.css";

const PrincipalHeader = () => {
  return (
    <header className="principal__header">

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

      {/* <nav className="nav__principal__header">
        <ul className="ul_principal__header">
          <li>
            <Link className="link__principal__header" to="/login">
              login
            </Link>
          </li>
        </ul>
      </nav> */}
    </header>
  );
};

export default PrincipalHeader;
