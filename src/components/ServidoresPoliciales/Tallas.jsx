import React, { useEffect, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/states/alert.slice";
import Alert from "../shared/Alert";
import IsLoading from "../shared/IsLoading";

const Tallas = ({ servidor, desplazamientos }) => {
  const dispatch = useDispatch();
  const [hide, setHide] = useState(true);
  const [hideDelete, setHideDelete] = useState(true);
  const [idDelete, setIdDelete] = useState("");
  const [tallaEdit, setTallaEdit] = useState("");
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const diasEdicion = import.meta.env.VITE_DIAS_EDICION;
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;
  const userLoggued = JSON.parse(localStorage.user ? localStorage.user : 0);
  const PATH_TALLAS = "/tallas";

  const [
    talla,
    getTalla,
    postTalla,
    deleteTalla,
    updateTalla,
    error,
    isLoading,
    newReg,
    deleteReg,
    updateReg,
  ] = useCrud();

  const {
    register,
    handleSubmit,
    reset,
    value,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const submit = (data) => {
    if (tallaEdit) {
      updateTalla(PATH_TALLAS, tallaEdit.id, {
        ...data,
        usuarioEdicion: userCI,
      });
    } else {
      postTalla(PATH_TALLAS, {
        ...data,
        servidorPolicialId: servidor.id,
        usuarioRegistro: userCI,
        usuarioEdicion: userCI,
      });
    }
    setTallaEdit("");
    setHide(true);
    reset({
      calzado: "",
      camisaSport: "",
      camisaCorbata: "",
      camisaPolo: "",
      camisetaB2: "",
      chaleco: "",
      chaquetaB2: "",
      chompa: "",
      correa: "",
      gorra: "",
      kepiB2: "",
      pantalonB2: "",
      pantalonTerno: "",
      pantalonOperativo: "",
      sacoTerno: "",
      usuarioRegistro: "",
      usuarioEdicion: "",
    });
  };

  const handleHideDelete = (talla) => {
    setHideDelete(false);
    setIdDelete(talla);
  };

  const handleDelete = () => {
    deleteTalla(PATH_TALLAS, idDelete.id);
    setHideDelete(true);
    setIdDelete("");
  };

  const handleEditTalla = (talla) => {
    setTallaEdit(talla);
    setHide(false);
  };

  useEffect(() => {
    getTalla(PATH_TALLAS);
  }, []);

  useEffect(() => {
    reset(tallaEdit);
  }, [tallaEdit]);

  useEffect(() => {
    if (error) {
      dispatch(
        showAlert({
          message:
            ` ⚠️ ${error.response?.data?.message} ` || "Error inesperado",
          alertType: 1,
        })
      );
    }
  }, [error]);

  useEffect(() => {
    if (newReg) {
      dispatch(
        showAlert({
          message: ` ⚠️ Se creo un nuevo Registro`,
          alertType: 2,
        })
      );
    }
  }, [newReg]);

  useEffect(() => {
    if (deleteReg) {
      dispatch(
        showAlert({
          message: `⚠️ Se Elimino el Registro  `,
          alertType: 4,
        })
      );
    }
  }, [deleteReg]);

  useEffect(() => {
    if (updateReg) {
      dispatch(
        showAlert({
          message: `⚠️ Se Actualizo el Registro`,
          alertType: 2,
        })
      );
    }
  }, [updateReg]);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const ultimoDesplazamiento = desplazamientos
    ?.slice()
    .filter(
      (desplazamiento) => desplazamiento.servidorPolicialId === servidor.id
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  return (
    <div>
      {isLoading && <IsLoading />}
      <article>
        <section
          className={`form__container__info ${
            hide && "form__container__info__close"
          }`}
        >
          <form className="form__info" onSubmit={handleSubmit(submit)}>
            <div
              onClick={() => {
                setTallaEdit("");
                setHide(true);
                reset({
                  calzado: "",
                  camisaSport: "",
                  camisaCorbata: "",
                  camisaPolo: "",
                  camisetaB2: "",
                  chaleco: "",
                  chaquetaB2: "",
                  chompa: "",
                  correa: "",
                  gorra: "",
                  kepiB2: "",
                  pantalonB2: "",
                  pantalonTerno: "",
                  pantalonOperativo: "",
                  sacoTerno: "",
                  usuarioRegistro: "",
                  usuarioEdicion: "",
                });
              }}
              className="btn__exit__form__info"
            >
              ❌
            </div>
            <label className="label__form">
              <span className="span__form__info">Calzado: </span>
              <input
                className="input__form__info"
                required
                {...register("calzado")}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">Camisa cuello Sport: </span>
              <input
                className="input__form__info"
                required
                {...register("camisaSport")}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">Camisa para Corbata: </span>
              <input
                className="input__form__info"
                required
                {...register("camisaCorbata")}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">Camisa Polo: </span>
              <input
                className="input__form__info"
                required
                {...register("camisaPolo")}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">Camiseta B2 Operativo: </span>
              <input
                className="input__form__info"
                required
                {...register("camisetaB2")}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">Chaleco Balístico: </span>
              <select
                className="select__form__info"
                required
                {...register("chaleco")}
              >
                <option value="">Seleccione la talla</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </label>
            <label className="label__form">
              <span className="span__form__info">Chaqueta B2 Operativo: </span>
              <input
                className="input__form__info"
                required
                {...register("chaquetaB2")}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">Chompa Funcional: </span>
              <input
                className="input__form__info"
                required
                {...register("chompa")}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">Correa Táctica: </span>

              <select
                className="select__form__info"
                required
                {...register("correa")}
              >
                <option value="">Seleccione la talla</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </label>
            <label className="label__form">
              <span className="span__form__info">Gorra: </span>
              <input
                className="input__form__info"
                required
                {...register("gorra")}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">Kepi B2 Operativo: </span>
              <select
                className="select__form__info"
                required
                {...register("kepiB2")}
              >
                <option value="">Seleccione la talla</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </label>
            <label className="label__form">
              <span className="span__form__info">Pantalón B2 Operativo: </span>
              <input
                className="input__form__info"
                required
                {...register("pantalonB2")}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">Pantalón de Terno: </span>
              <input
                className="input__form__info"
                required
                {...register("pantalonTerno")}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">Pantalón Operativo: </span>
              <input
                className="input__form__info"
                required
                {...register("pantalonOperativo")}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">Saco de Terno: </span>
              <input
                className="input__form__info"
                required
                {...register("sacoTerno")}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </label>
            <button
              disabled={
                tallaEdit
                  ? false
                  : talla.some(
                      (talla) => talla.servidorPolicialId === servidor.id
                    )
              }
            >
              {tallaEdit ? "Actualizar" : "Guardar"}
            </button>
          </form>
        </section>
        <section>
          <table>
            <thead>
              <tr>
                <th style={{ border: "none", backgroundColor: "transparent" }}>
                  {!(tallaEdit
                    ? false
                    : talla.some(
                        (talla) => talla.servidorPolicialId === servidor.id
                      )) &&
                    ((ultimoDesplazamiento &&
                      !ultimoDesplazamiento.fechaFinalización &&
                      ultimoDesplazamiento.unidad === userLoggued.unidad &&
                      ultimoDesplazamiento.unidadSubzona ===
                        userLoggued.unidadSubzona) ||
                      (ultimoDesplazamiento &&
                        ultimoDesplazamiento.fechaPresentacion &&
                        ultimoDesplazamiento.fechaFinalización &&
                        ultimoDesplazamiento.unidadSubzona !==
                          userLoggued.unidadSubzona) ||
                      !ultimoDesplazamiento ||
                      userLoggued.tipoDesignacion === "NOPERA" ||
                      userCI === superAdmin ||
                      ultimoDesplazamiento.direccion === "OTROS") && (
                      <img
                        src="../../../new.png"
                        className="btn__table"
                        onClick={() => setHide(false)}
                      />
                    )}
                </th>
                <th>CALZADO </th>
                <th>CAMISA CUELLO SPORT</th>
                <th>CAMISA PARA CORBATA</th>
                <th>CAMISA POLO</th>
                <th>CAMISETA B2 OPERATIVO</th>
                <th>CHALECO BALÍSTICO</th>
                <th>CHAQUETA B2 OPERATIVO</th>
                <th>CHOMPA FUNCIONAL</th>
                <th>CORREA TÁCTICA</th>
                <th>GORRA</th>
                <th>KEPI B2 OPERATIVO</th>
                <th>PANTALON B2 OPERATIVO</th>
                <th>PANTALÓN DE TERNO</th>
                <th>PANTALÓN OPERATIVO</th>
                <th>SACO DE TERNO</th>
              </tr>
            </thead>
            <tbody>
              {talla
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .filter((talla) => talla.servidorPolicialId === servidor.id)
                .map((talla) => (
                  <tr key={talla.id}>
                    <td
                      style={{ border: "none", backgroundColor: "transparent" }}
                    >
                      {((ultimoDesplazamiento &&
                        !ultimoDesplazamiento.fechaFinalización &&
                        ultimoDesplazamiento.unidad === userLoggued.unidad &&
                        ultimoDesplazamiento.unidadSubzona ===
                          userLoggued.unidadSubzona) ||
                        (ultimoDesplazamiento &&
                          ultimoDesplazamiento.fechaPresentacion &&
                          ultimoDesplazamiento.fechaFinalización &&
                          ultimoDesplazamiento.unidadSubzona !==
                            userLoggued.unidadSubzona) ||
                        !ultimoDesplazamiento ||
                        userLoggued.tipoDesignacion === "NOPERA" ||
                        userCI === superAdmin ||
                        ultimoDesplazamiento.direccion === "OTROS") && (
                        <img
                          src="../../../edit.png"
                          className="btn__table"
                          onClick={() => handleEditTalla(talla)}
                        />
                      )}

                      {userLoggued.cI === superAdmin && (
                        <img
                          src="../../../delete.png"
                          className="btn__table"
                          onClick={() => handleHideDelete(talla)}
                        />
                      )}
                    </td>
                    <td className="table__td">{talla.calzado}</td>
                    <td className="table__td">{talla.camisaSport}</td>
                    <td className="table__td">{talla.camisaCorbata}</td>
                    <td className="table__td">{talla.camisaPolo}</td>
                    <td className="table__td">{talla.camisetaB2}</td>
                    <td className="table__td">{talla.chaleco}</td>
                    <td className="table__td">{talla.chaquetaB2}</td>
                    <td className="table__td">{talla.chompa}</td>
                    <td className="table__td">{talla.correa}</td>
                    <td className="table__td">{talla.gorra}</td>
                    <td className="table__td">{talla.kepiB2}</td>
                    <td className="table__td">{talla.pantalonB2}</td>
                    <td className="table__td">{talla.pantalonTerno}</td>
                    <td className="table__td">{talla.pantalonOperativo}</td>
                    <td className="table__td">{talla.sacoTerno}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
        <section
          className={`form__container__info ${
            hideDelete && "form__container__info__close"
          }`}
        >
          <div className="form__info">
            <span className="delete__card">
              Esta seguro de eliminar el Registro
            </span>
            <div className="btn__delete__content">
              <button onClick={handleDelete} className="btn__form__info">
                SI
              </button>
              <button
                onClick={() => setHideDelete(true)}
                className="btn__form__info"
              >
                NO
              </button>
            </div>
          </div>
        </section>
      </article>
      <Alert />
    </div>
  );
};

export default Tallas;
