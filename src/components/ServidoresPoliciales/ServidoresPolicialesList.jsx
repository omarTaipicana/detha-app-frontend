import React, { useEffect, useState } from "react";
import "./style/CardServidoresPoliciales.css";
import "./style/CardServidor.css";
import CardServidoresPoliciales from "./CardServidoresPoliciales";
import useCrud from "../../hooks/useCrud";
import CardServidor from "./CardServidor";
import IsLoading from "../shared/IsLoading";
import useAuth from "../../hooks/useAuth";

const ServidoresPolicialesList = ({
  setFormIsClouse,
  formIsClouse,
  setServidorEdit,
  servidorEdit,
}) => {
  const [, , , , , , , , , , , getUserLogged, user] = useAuth();
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const [hide, setHide] = useState(true);
  const [servidor, setServidor] = useState("");
  const [updatedelete, setUpdatedelete] = useState(false);
  const PATH = "/servidores";
  const [servidorPolicial, getApi, , , , , isLoading] = useCrud();

  const [selectedDireccion, setSelectedDireccion] = useState("");
  const [selectedUnidad, setSelectedUnidad] = useState("");
  const [selectedUnidadSubzona, setSelectedUnidadSubzona] = useState("");
  const [desplazamiento, setDesplazamiento] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUserLogged();
  }, []);

  const desplazamientos = Array.from(
    new Set(
      servidorPolicial.flatMap((item) => {
        const ultimoDesplazamiento = item.desplazamientos.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const filtrado = ultimoDesplazamiento.filter(
          (d) => !d.fechaFinalización
        );
        return filtrado.length > 0 ? filtrado[0].tipoDesplazamiento : [];
      })
    )
  );

  const servidorPolicialFiltered = servidorPolicial
    ?.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((serv) => {
      const ultimoPase = serv.pases
        ?.slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      const ultimoDesplazamiento = serv.desplazamientos
        ?.slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (user?.cI === superAdmin) {
        return serv.id;
      }

      if (serv.pases.length === 0) {
        return serv.usuarioRegistro === user?.cI;
      }

      if (
        ultimoPase.direccion === "OTROS" &&
        serv.desplazamientos.length === 0
      ) {
        return serv.usuarioRegistro === user?.cI;
      }

      if (user?.unidadSubzona === "Planta Administrativa DIGIN") {
        return ultimoPase.direccion !== "OTROS";
      }

      if (
        ultimoDesplazamiento &&
        new Date(ultimoDesplazamiento?.fechaPresentacion) <= hoy &&
        !ultimoDesplazamiento?.fechaFinalización &&
        user?.unidadSubzona.slice(0, 21) === "Planta Administrativa"
      ) {
        return (
          ultimoPase.direccion === user?.direccion ||
          ultimoDesplazamiento?.direccion === user?.direccion
        );
      }

      if (user?.unidadSubzona.slice(0, 21) === "Planta Administrativa") {
        return ultimoPase.direccion === user?.direccion;
      }

      if (
        ultimoDesplazamiento &&
        new Date(ultimoDesplazamiento?.fechaPresentacion) <= hoy &&
        !ultimoDesplazamiento?.fechaFinalización &&
        user?.tipoDesignacion === "NOPERA"
      ) {
        return (
          ultimoPase?.unidad === user?.unidad ||
          ultimoDesplazamiento?.unidad === user?.unidad
        );
      }

      if (user?.tipoDesignacion === "NOPERA") {
        return ultimoPase.unidad === user?.unidad;
      }

      if (
        ultimoDesplazamiento &&
        new Date(ultimoDesplazamiento?.fechaPresentacion) <= hoy &&
        !ultimoDesplazamiento?.fechaFinalización
      ) {
        return (
          (ultimoDesplazamiento?.unidadSubzona === user?.unidadSubzona &&
            ultimoDesplazamiento?.unidad === user?.unidad) ||
          (ultimoPase.unidadSubzona === user?.unidadSubzona &&
            ultimoPase.unidad === user?.unidad)
        );
      }

      return (
        ultimoPase.unidadSubzona === user?.unidadSubzona &&
        ultimoPase.unidad === user?.unidad
      );
    });

  const filterServ = (user, ignoreSelected = {}) => {
    const ultimoPase = user?.pases
      ?.slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    return (
      (!selectedDireccion ||
        ignoreSelected.direccion ||
        ultimoPase?.direccion === selectedDireccion) &&
      (!selectedUnidad ||
        ignoreSelected.unidad ||
        ultimoPase?.unidad === selectedUnidad) &&
      (!selectedUnidadSubzona ||
        ignoreSelected.unidadSubzona ||
        ultimoPase?.unidadSubzona === selectedUnidadSubzona)
    );
  };

  const uniqueValues = (key, ignoreSelected = {}) => {
    return servidorPolicialFiltered
      ? [
          ...new Set(
            servidorPolicialFiltered
              .filter((serv) => filterServ(serv, ignoreSelected))
              .map((serv) => {
                const lastPase = serv.pases
                  ?.slice()
                  .sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  )[0];
                return lastPase ? lastPase[key] : null;
              })
              .filter(Boolean)
          ),
        ]
      : [];
  };

  const direcciones = uniqueValues("direccion", { direccion: true });
  const unidades = uniqueValues("unidad", { unidad: true });
  const unidadesSubzona = uniqueValues("unidadSubzona", {
    unidadSubzona: true,
  });

  const filteredServ = servidorPolicialFiltered
    ?.filter((serv) => filterServ(serv))
    .filter((serv) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (serv.cI && serv.cI.toLowerCase().includes(searchLower)) ||
        (serv.nombres && serv.nombres.toLowerCase().includes(searchLower)) ||
        (serv.apellidos && serv.apellidos.toLowerCase().includes(searchLower))
      );
    })
    .filter((serv) => {
      const ultimoDesplazamiento = serv?.desplazamientos
        ?.slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      if (!desplazamiento) {
        return true;
      }
      if (desplazamiento === "TODOS") {
        return ultimoDesplazamiento && !ultimoDesplazamiento.fechaFinalización;
      }
      return (
        ultimoDesplazamiento &&
        ultimoDesplazamiento.tipoDesplazamiento === desplazamiento &&
        !ultimoDesplazamiento.fechaFinalización
      );
    });

  useEffect(() => {
    getApi(PATH);
  }, [servidorEdit, formIsClouse, hide, updatedelete]);

  useEffect(() => {
    setPage(1);
    setPageButton(1);
  }, [searchTerm, selectedDireccion, selectedUnidad, selectedUnidadSubzona]);

  const [page, setPage] = useState(1);
  const servPol = 8;
  const lastIndexPage = page * servPol;
  const firstIndexPage = lastIndexPage - servPol;
  const servPerPage = filteredServ?.slice(firstIndexPage, lastIndexPage);
  const totalPage = Math.ceil(filteredServ?.length / servPol);
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
          className={`filters__users ${selectedDireccion && "change__color"}`}
          value={selectedDireccion}
          onChange={(e) => {
            setSelectedDireccion(e.target.value);
            setSelectedUnidad("");
            setSelectedUnidadSubzona("");
          }}
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

        <select
          className={`filters__users ${desplazamiento && "change__color"}`}
          value={desplazamiento}
          onChange={(e) => setDesplazamiento(e.target.value)}
          disabled={!unidades.length}
        >
          <option value="">DESPLAZAMIENTOS</option>
          <option value="TODOS">TODOS</option>
          {desplazamientos.map((desplazamientos) => (
            <option key={desplazamientos} value={desplazamientos}>
              {desplazamientos}
            </option>
          ))}
        </select>

        <button
          className="btn__users__users"
          onClick={() => {
            setSelectedDireccion("");
            setSelectedUnidad("");
            setSelectedUnidadSubzona("");
            setSearchTerm("");
            setDesplazamiento("");
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
          Registrar Servidor
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

          <img
            className="clear-button img__buscar"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search "
            src="../../../goma.png"
            alt=""
          />
        </div>
      </div>

      <div className="card__servidorPolicial__content">
        <div className="filters__users__search__container__mobile">
          <img className="img__buscar" src="../../../buscar.png" alt="" />

          <input
            type="text"
            className="filters__users__search"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <img
            className="clear-button img__buscar"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search "
            src="../../../goma.png"
            alt=""
          />
        </div>

        {servPerPage.map((servidorPolicial) => (
          <CardServidoresPoliciales
            key={servidorPolicial.id}
            servidorPolicial={servidorPolicial}
            setHide={setHide}
            setServidor={setServidor}
            setFormIsClouse={setFormIsClouse}
            setServidorEdit={setServidorEdit}
            setUpdatedelete={setUpdatedelete}
            updatedelete={updatedelete}
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
        {filteredServ?.length}
      </div>
      <CardServidor servidor={servidor} hide={hide} setHide={setHide} />
    </div>
  );
};

export default ServidoresPolicialesList;
