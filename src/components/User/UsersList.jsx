import React, { useEffect, useState } from "react";
import CardUser from "./CardUser";
import "./styles/CardUsers.css"
import useAuth from "../../hooks/useAuth";
import IsLoading from "../shared/IsLoading";

const UsersList = ({ userEdit, setUserEdit, setFormIsClouse, newUser }) => {
  const [, , , , , isLoading, users, getUsers, , , , getUserLogged, user] =
    useAuth();
  const userCI = user?.cI;
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;
  const rolSubAdmin = import.meta.env.VITE_ROL_SUB_ADMIN;
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const userLoggued = user;

  const [update, setUpdate] = useState(false);

  const [selectedRol, setSelectedRol] = useState("");
  const [selectedDireccion, setSelectedDireccion] = useState("");
  const [selectedUnidad, setSelectedUnidad] = useState("");
  const [selectedUnidadSubzona, setSelectedUnidadSubzona] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsersRol = users
    ?.filter((user) => {
      if (userLoggued?.cI === superAdmin) {
        return true;
      }

      if (userLoggued?.rol === rolAdmin) {
        return user.cI !== userCI;
      }

      if (userLoggued?.rol === rolSubAdmin) {
        return user.usuarioControl === userCI;
      }

      return false;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filterUsers = (user, ignoreSelected = {}) => {
    return (
      (!selectedRol || ignoreSelected.rol || user.rol === selectedRol) &&
      (!selectedDireccion ||
        ignoreSelected.direccion ||
        user.direccion === selectedDireccion) &&
      (!selectedUnidad ||
        ignoreSelected.unidad ||
        user.unidad === selectedUnidad) &&
      (!selectedUnidadSubzona ||
        ignoreSelected.unidadSubzona ||
        user.unidadSubzona === selectedUnidadSubzona)
    );
  };

  const uniqueValues = (key, ignoreSelected = {}) => {
    return filteredUsersRol
      ? [
          ...new Set(
            filteredUsersRol
              .filter((user) => filterUsers(user, ignoreSelected))
              .map((user) => user[key])
          ),
        ]
      : [];
  };

  const roles = uniqueValues("rol", { rol: true });
  const direcciones = uniqueValues("direccion", { direccion: true });
  const unidades = uniqueValues("unidad", { unidad: true });
  const unidadesSubzona = uniqueValues("unidadSubzona", {
    unidadSubzona: true,
  });

  const filteredUsers = filteredUsersRol
    ?.filter((user) => filterUsers(user))
    .filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.cI.toLowerCase().includes(searchLower) ||
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower)
      );
    });

  useEffect(() => {
    getUserLogged();
  }, []);

  useEffect(() => {
    getUsers();
  }, [userEdit, newUser, update]);

  useEffect(() => {
    setPage(1);
    setPageButton(1);
  }, [
    searchTerm,
    selectedRol,
    selectedDireccion,
    selectedUnidad,
    selectedUnidadSubzona,
  ]);

  const [page, setPage] = useState(1);
  const userPage = 5;
  const lastIndexPage = page * userPage;
  const firstIndexPage = lastIndexPage - userPage;
  const userPerPage = filteredUsers?.slice(firstIndexPage, lastIndexPage);
  const totalPage = Math.ceil(filteredUsers?.length / userPage);
  const pageNumbers = [];

  const [pageButton, setPageButton] = useState(1);
  const buttonPerPage = 10;
  const lastIndexPageButton = pageButton * buttonPerPage;
  const firstIndexPageButton = lastIndexPageButton - buttonPerPage;
  const totalPageButton = Math.ceil(totalPage / buttonPerPage);

  for (
    let i = firstIndexPageButton + 1;
    i <= (lastIndexPageButton > totalPage ? totalPage : lastIndexPageButton);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div>
      {isLoading && <IsLoading />}
      <div className="filters__users__content">
        <select
          className={`filters__users ${selectedRol && "change__color"}`}
          value={selectedRol}
          onChange={(e) => {
            setSelectedRol(e.target.value);
            setSelectedDireccion("");
            setSelectedUnidad("");
            setSelectedUnidadSubzona("");
          }}
        >
          <option value="">ROL</option>
          {roles.map((rol) => (
            <option key={rol} value={rol}>
              {rol}
            </option>
          ))}
        </select>
        <select
          className={`filters__users ${selectedDireccion && "change__color"}`}
          value={selectedDireccion}
          onChange={(e) => {
            setSelectedDireccion(e.target.value);
            setSelectedUnidad("");
            setSelectedUnidadSubzona("");
          }}
          disabled={!roles.length}
        >
          <option value="">DIRECCIÓN</option>
          {direcciones.map((direccion) => (
            <option key={direccion} value={direccion}>
              {direccion}
            </option>
          ))}
        </select>
        <select
          className={`filters__users ${selectedUnidad && "change__color"}`}
          value={selectedUnidad}
          onChange={(e) => {
            setSelectedUnidad(e.target.value);
            setSelectedUnidadSubzona("");
          }}
          disabled={!direcciones.length}
        >
          <option value="">UNIDAD</option>
          {unidades.map((unidad) => (
            <option key={unidad} value={unidad}>
              {unidad}
            </option>
          ))}
        </select>
        <select
          className={`filters__users ${
            selectedUnidadSubzona && "change__color"
          }`}
          value={selectedUnidadSubzona}
          onChange={(e) => setSelectedUnidadSubzona(e.target.value)}
          disabled={!unidades.length}
        >
          <option value="">SUBZONA</option>
          {unidadesSubzona.map((unidadSubzona) => (
            <option key={unidadSubzona} value={unidadSubzona}>
              {unidadSubzona}
            </option>
          ))}
        </select>

        <button
          className="btn__users__users"
          onClick={() => {
            setSelectedRol("");
            setSelectedDireccion("");
            setSelectedUnidad("");
            setSelectedUnidadSubzona("");
            setSearchTerm("");
          }}
        >
          Resetear Filtros
        </button>
        <button
          onClick={() => {
            setFormIsClouse(false);
          }}
          className="btn__users__users"
        >
          + Agregar Usuario
        </button>
        <div className="filters__users__search__container">
          <img className="img__buscar" src="../../../buscar.png" alt="" />

          <input
            type="text"
            className="filters__users__search"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && (
            <img
              className="clear-button img__buscar"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search "
              src="../../../goma.png"
              alt=""
            />
          )}
        </div>
      </div>

      <div className="card__users__content">
        {userPerPage?.map((user) => (
          <CardUser
            user={user}
            key={user.cI}
            setUserEdit={setUserEdit}
            setFormIsClouse={setFormIsClouse}
            update={update}
            setUpdate={setUpdate}
          />
        ))}
      </div>
      <div className="paginated-content">
        <button
          className="btn-buttton-page-content"
          onClick={() => {
            setPageButton(pageButton - 1);
            setPage(page - buttonPerPage);
          }}
          disabled={pageButton === 1}
          style={{ opacity: pageButton === 1 ? ".1" : "" }}
        >
          <div className="triangulo_izq"></div>
        </button>
        <button
          className="btn-page-card"
          onClick={() => {
            setPage(page - 1);
            if (page === lastIndexPageButton - buttonPerPage + 1) {
              setPageButton(pageButton - 1);
            }
          }}
          disabled={page === 1}
          style={{ opacity: page === 1 ? ".1" : "" }}
        >
          -
        </button>
        <button
          className="btn-page help"
          onClick={() => {
            setPage(1);
            setPageButton(1);
          }}
        >
          {1}
        </button>
        <span>..</span>
        {pageNumbers.map((number, i) => (
          <button
            style={{
              background: number == page ? "rgba(255, 255, 0,0.8)" : "",
              color: number == page ? "black" : "",
            }}
            className="btn-page"
            key={i}
            onClick={() => setPage(number)}
          >
            {number}
          </button>
        ))}
        <span>..</span>
        <button
          className="btn-page help"
          onClick={() => {
            setPage(totalPage);
            setPageButton(Math.ceil(totalPage / buttonPerPage));
          }}
        >
          {totalPage.toString()}
        </button>
        <button
          className="btn-page-card"
          onClick={() => {
            setPage(page + 1);
            if (page === lastIndexPageButton) {
              setPageButton(pageButton + 1);
            }
          }}
          disabled={page === totalPage}
          style={{ opacity: page === totalPage ? ".1" : "" }}
        >
          +
        </button>
        <button
          className="btn-buttton-page-content"
          onClick={() => {
            setPageButton(pageButton + 1);
            setPage(page + buttonPerPage);
          }}
          disabled={pageButton === totalPageButton}
          style={{ opacity: pageButton === totalPageButton ? ".1" : "" }}
        >
          <div className="triangulo_der"></div>
        </button>
      </div>
      <div className="servidores__page">
        <b>Page:</b>
        {page}
        <br />
        <b>Total:</b>
        {filteredUsers?.length}
      </div>
    </div>
  );
};

export default UsersList;
