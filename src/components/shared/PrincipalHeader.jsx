import React from "react";
import { Link } from "react-router-dom";
import "./styles/PrincipalHeader.css";
import { useNavigate } from "react-router-dom";

const PrincipalHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.user ? localStorage.user : 0);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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

      <div>
        <span>{user? `Saludos Cordiales ${user.firstName} ${user.lastName}`:""}</span>
        <button className="link__principal__header" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default PrincipalHeader;
