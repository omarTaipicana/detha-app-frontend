import React, { useEffect, useState } from "react";
import "./styles/CardUsers.css";
import useAuth from "../../hooks/useAuth";
import IsLoading from "../shared/IsLoading";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/states/alert.slice";

const CardUser = ({
  user,
  setUserEdit,
  setFormIsClouse,
  update,
  setUpdate,
}) => {
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;
  const rolSubAdmin = import.meta.env.VITE_ROL_SUB_ADMIN;
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const userLoggued = JSON.parse(localStorage.user ? localStorage.user : 0);
  const dispatch = useDispatch();
  const [hideDelete, setHideDelete] = useState(true);
  const [
    registerUser,
    loginUser,
    verifyUser,
    sendEmail,
    error,
    isLoading,
    users,
    getUsers,
    updateUser,
    handleRes,
    deleteUser,
  ] = useAuth();

  const handleEdituser = () => {
    setUserEdit(user);
    setFormIsClouse(false);
  };

  const handleHideDelete = () => {
    setHideDelete(false);
  };

  const handleDelete = () => {
    deleteUser(user.id);
    setHideDelete(true);
  };

  useEffect(() => {
    if (handleRes) {
      dispatch(
        showAlert({
          message: `⚠️ Se elimino correctamente el usuario de ${handleRes?.firstName} ${handleRes?.lastName}`,
          alertType: 4,
        })
      );
      setUpdate(!update);
    }
  }, [handleRes]);

  return (
    <div>
      {isLoading && <IsLoading />}
      <div className="card__user">
        <ul className="card__ul">
          <li className="card__li__img">
            <img onClick={handleEdituser} src="../../../edit.png" alt="" />
            {userLoggued.cI === superAdmin && (
              <img
                onClick={handleHideDelete}
                src="../../../delete.png"
                alt=""
              />
            )}{" "}
          </li>
          <li className="card__li corto">
            <span className="card__label">Cedula: </span>
            <span className="card__value">{user.cI}</span>
          </li>
          <li className="card__li corto">
            <span className="card__label">Nombres: </span>
            <span className="card__value">{user.firstName}</span>
          </li>
          <li className="card__li corto">
            <span className="card__label">Apellidios: </span>
            <span className="card__value">{user.lastName}</span>
          </li>
          <li className="card__li largo">
            <span className="card__label">Correo electrónico: </span>
            <span className="card__value">{user.email}</span>
          </li>
          <li className="card__li largo">
            <span className="card__label">Dirección - Unidad: </span>
            <span className="card__value">
              {user.direccion}-{user.unidad}
            </span>
          </li>
          <li className="card__li largo">
            <span className="card__label">Control: </span>
            <span className="card__value">{user.unidadSubzona}</span>
          </li>
          <li className="card__li corto">
            <span className="card__label">Rol Usuario: </span>
            <span
              className="card__value"
              style={{
                color:
                  user.rol === rolAdmin
                    ? "red"
                    : user.rol === rolSubAdmin
                    ? "blue"
                    : "green",
              }}
            >
              {user.rol}
            </span>
          </li>
          <li className="card__li corto">
            <span className="card__label">Sistema: </span>
            <span
              className="card__value"
              style={{ color: user.enabled ? "green" : "red" }}
            >
              {user.enabled ? "Habilitado" : "Deshabilitado"}
            </span>
          </li>
          <li className="card__li">
            <span className="card__label">V. </span>
            <span
              className="card__value__v"
              style={{ backgroundColor: user.isVerified ? "green" : "red" }}
            ></span>
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
              <button
                onClick={() => setHideDelete(true)}
                className="btn__delete"
              >
                NO
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CardUser;
