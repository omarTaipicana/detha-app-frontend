import React, { useEffect, useState } from "react";
import axios from "axios";
import getConfigToken from "../../services/getConfigToken";
import useCrud from "../../hooks/useCrud";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/states/alert.slice";
import Alert from "../shared/Alert";
import IsLoading from "../shared/IsLoading";
import useAuth from "../../hooks/useAuth";

const Pases = ({ servidor, desplazamientos }) => {
  const [, , , , , , , , , , , getUserLogged, user] = useAuth();
  const dispatch = useDispatch();
  const urlBase = import.meta.env.VITE_API_URL;
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const diasEdicion = import.meta.env.VITE_DIAS_EDICION;
  const userCI = user?.cI;
  const userLoggued = user;

  const [hide, setHide] = useState(true);
  const [hideDelete, setHideDelete] = useState(true);
  const [idDelete, setIdDelete] = useState("");
  const [paseEdit, setPaseEdit] = useState("");
  const [organicos, setOrganicos] = useState([]);
  const [selectedDireccion, setSelectedDireccion] = useState("");
  const [selectedUnidad, setSelectedUnidad] = useState("");
  const [selectedSiglas, setSelectedSiglas] = useState("");
  const [selectedCargo, setSelectedCargo] = useState("");
  const [unidadesOptions, setUnidadesOptions] = useState([]);
  const [siglasOptions, setSiglasOptions] = useState([]);
  const [cargoOptions, setCargoOptions] = useState([]);

  const PATH_PASES = "/pases";
  const [
    pase,
    getPase,
    postPase,
    deletePase,
    updatePase,
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

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const ultimoDesplazamiento = desplazamientos
    ?.slice()
    .filter(
      (desplazamiento) => desplazamiento.servidorPolicialId === servidor.id
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  const ultimoPase = servidor.pases.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )[0];

  const submit = (data) => {
    if (!paseEdit) {
      if (
        ultimoDesplazamiento &&
        (!ultimoDesplazamiento.fechaPresentacion ||
          !ultimoDesplazamiento.fechaFinalización)
      ) {
        dispatch(
          showAlert({
            message:
              " ⚠️ No se puede registrar un nuevo Pase, finalice primero el ultimo Desplazamiento",
            alertType: 1,
          })
        );
        return;
      }

      postPase(PATH_PASES, {
        ...data,
        servidorPolicialId: servidor.id,
        usuarioRegistro: userCI,
        usuarioEdicion: userCI,
      });
    } else {
      updatePase(PATH_PASES, paseEdit.id, {
        ...data,
        usuarioEdicion: userCI,
      });
    }
    setSelectedDireccion("");
    setSelectedUnidad("");
    setSelectedSiglas("");
    setSelectedCargo("");
    reset({
      numeroTelegrama: "",
      fechaTelegrama: "",
      direccion: "",
      unidad: "",
      nomenclatura: "",
      nomenclaturaNoDigin: "",
    });

    setPaseEdit("");
    setHide(true);
  };

  const handleHideDelete = (pase) => {
    setHideDelete(false);
    setIdDelete(pase);
  };

  const handleDelete = () => {
    deletePase(PATH_PASES, idDelete.id);
    setHideDelete(true);
    setIdDelete("");
  };

  const handleEditPase = (pase) => {
    setPaseEdit(pase);
    setHide(false);
  };
  useEffect(() => {
    getUserLogged();
    getPase(PATH_PASES);
    axios
      .get(`${urlBase}/organicos`, getConfigToken())
      .then((res) => setOrganicos(res.data))
      .catch((err) => console.log(err));

    reset(paseEdit);
    setUnidadesOptions(obtenerUnidadesPorDireccion(paseEdit?.direccion));
    setSiglasOptions(obtenerSiglasPorUnidad(paseEdit?.unidad));
    setCargoOptions(obtenerCargosPorSigla(paseEdit?.nomenclatura));

    setSelectedDireccion(paseEdit?.direccion);
    setSelectedUnidad(paseEdit?.unidad);
    setSelectedSiglas(paseEdit?.nomenclatura);
    setSelectedCargo(paseEdit?.cargo);
  }, [paseEdit]);

  useEffect(() => {
    if (selectedDireccion !== "OTROS") {
      setValue("nomenclaturaNoDigin", "");
    }
  }, [selectedDireccion, setValue]);

  const obtenerUnidadesPorDireccion = (siglasDireccion) => {
    return organicos.filter((item) => item.siglasDireccion === siglasDireccion);
  };
  const obtenerSiglasPorUnidad = (siglaUnidadGrupo) => {
    return organicos.filter(
      (item) => item.siglaUnidadGrupo === siglaUnidadGrupo
    );
  };
  const obtenerCargosPorSigla = (nomenclatura) => {
    return organicos.filter((item) => item.nomenclatura === nomenclatura);
  };

  const handleDireccionChange = (selected) => {
    setSelectedDireccion(selected);
    const unidadesByDireccion = obtenerUnidadesPorDireccion(selected);
    setUnidadesOptions(unidadesByDireccion);
    setSelectedUnidad("");
    setSelectedSiglas("");
    setSelectedCargo("");
    setCargoOptions([]);
    setSiglasOptions([]);
  };

  const handleUnidadChange = (selected) => {
    setSelectedUnidad(selected);
    const siglasByUnidad = obtenerSiglasPorUnidad(selected);
    setSiglasOptions(siglasByUnidad);
    setSelectedSiglas("");
    setSelectedCargo("");
    setCargoOptions([]);
  };

  const handleSiglasChange = (selected) => {
    setSelectedSiglas(selected);
    const cargoBySigla = obtenerCargosPorSigla(selected);
    setCargoOptions(cargoBySigla);
    setSelectedCargo("");
  };

  const handleCargoChange = (selected) => {
    setSelectedCargo(selected);
  };

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
          message: ` ⚠️ Se creo un nuevo Registro ${newReg.nomenclatura}`,
          alertType: 2,
        })
      );
    }
  }, [newReg]);

  useEffect(() => {
    if (deleteReg) {
      dispatch(
        showAlert({
          message: `⚠️ Se Elimino el Registro ${deleteReg.nomenclatura} `,
          alertType: 4,
        })
      );
    }
  }, [deleteReg]);

  useEffect(() => {
    if (updateReg) {
      dispatch(
        showAlert({
          message: `⚠️ Se Edito el Registro ${updateReg.nomenclatura}`,
          alertType: 2,
        })
      );
    }
  }, [updateReg]);

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
                setHide(true);
                setPaseEdit();
                reset({
                  numeroTelegrama: "",
                  fechaTelegrama: "",
                  direccion: "",
                  unidad: "",
                  nomenclatura: "",
                  nomenclaturaNoDigin: "",
                });
              }}
              className="btn__exit__form__info"
            >
              ❌
            </div>
            <label className="label__form">
              <span className="span__form__info">Número de Telegrama: </span>
              <input
                className="input__form__info"
                type="text"
                required
                {...register("numeroTelegrama")}
              />
            </label>
            <label className="label__form">
              <span className="span__form__info">Fecha Telegrama: </span>
              <input
                className="input__form__info"
                required
                type="date"
                {...register("fechaTelegrama", {
                  required: "La fecha es obligatoria",
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return (
                      selectedDate <= today ||
                      "La fecha no puede ser superior a hoy"
                    );
                  },
                })}
              />
            </label>
            {errors.fechaTelegrama && (
              <p style={{ color: "red" }}>{errors.fechaTelegrama.message}</p>
            )}
            <label className="label__form" htmlFor="">
              <span className="span__form__info">Dirección: </span>
              <select
                className="select__form__info"
                required
                {...register("direccion")}
                value={selectedDireccion}
                onChange={(e) => handleDireccionChange(e.target.value)}
              >
                <option value="">Seleccione la Dirección</option>
                {[...new Set(organicos.map((e) => e.siglasDireccion))].map(
                  (direccion) => (
                    <option key={direccion} value={direccion}>
                      {direccion}
                    </option>
                  )
                )}
              </select>
            </label>
            <label className="label__form" htmlFor="">
              <span className="span__form__info">Unidad: </span>
              <select
                className="select__form__info"
                required
                {...register("unidad")}
                value={selectedUnidad}
                onChange={(e) => handleUnidadChange(e.target.value)}
              >
                <option value="">Seleccione la Unidad</option>
                {[
                  ...new Set(unidadesOptions.map((e) => e.siglaUnidadGrupo)),
                ].map((unidad) => (
                  <option key={unidad} value={unidad}>
                    {unidad}
                  </option>
                ))}
              </select>
            </label>
            <label className="label__form" htmlFor="">
              <span className="span__form__info">Nomenclatura: </span>
              <select
                className="select__form__info"
                required
                {...register("nomenclatura")}
                value={selectedSiglas}
                onChange={(e) => handleSiglasChange(e.target.value)}
              >
                <option value="">Seleccione la Nomenclatura</option>
                {[...new Set(siglasOptions.map((e) => e.nomenclatura))].map(
                  (siglas) => (
                    <option key={siglas} value={siglas}>
                      {siglas}
                    </option>
                  )
                )}
              </select>
            </label>
            <label className="label__form" htmlFor="">
              <span className="span__form__info">Cargo: </span>
              <select
                className="select__form__info"
                required
                {...register("cargo")}
                value={selectedCargo}
                onChange={(e) => handleCargoChange(e.target.value)}
              >
                <option value="">Seleccione el Cargo</option>
                {[...new Set(cargoOptions.map((e) => e.cargoSiipne))].map(
                  (cargo) => (
                    <option key={cargo} value={cargo}>
                      {cargo}
                    </option>
                  )
                )}
              </select>
            </label>
            {selectedDireccion === "OTROS" && (
              <label className="label__form">
                <span className="span__form__info">
                  Nomenclatura si es fuera de la DIGIN
                </span>
                <input
                  className="input__form__info"
                  type="text"
                  {...register("nomenclaturaNoDigin", {
                    required: selectedDireccion === "OTROS",
                  })}
                />
              </label>
            )}
            <button className="btn__form__info">
              {paseEdit ? "Actualizar" : "Guardar"}
            </button>
          </form>
        </section>
        <section>
          <table className="table__info">
            <thead>
              <tr>
                <th style={{ border: "none", backgroundColor: "transparent" }}>
                  {((ultimoDesplazamiento &&
                    !ultimoDesplazamiento.fechaFinalización &&
                    ultimoDesplazamiento.unidad === userLoggued?.unidad &&
                    ultimoDesplazamiento.unidadSubzona ===
                      userLoggued?.unidadSubzona) ||
                    (ultimoDesplazamiento &&
                      ultimoDesplazamiento.fechaPresentacion &&
                      ultimoDesplazamiento.fechaFinalización &&
                      ultimoDesplazamiento.unidadSubzona !==
                        userLoggued?.unidadSubzona) ||
                    (ultimoDesplazamiento &&
                      ultimoDesplazamiento.fechaPresentacion &&
                      ultimoDesplazamiento.fechaFinalización &&
                      ultimoDesplazamiento.unidadSubzona ===
                        userLoggued?.unidadSubzona &&
                      ultimoPase.unidadSubzona ===
                        userLoggued?.unidadSubzona) ||
                    !ultimoDesplazamiento ||
                    userLoggued?.tipoDesignacion === "NOPERA" ||
                    userCI === superAdmin ||
                    ultimoDesplazamiento?.direccion === "OTROS") && (
                    <img
                      src="../../../new.png"
                      className="btn__table"
                      onClick={() => setHide(false)}
                    />
                  )}
                </th>
                <th>Nro. TELEGRAMA</th>
                <th>FECHA TELEGRAMA</th>
                <th>DIRECCIÓN</th>
                <th>UNIDAD</th>
                <th>NOMENCLATURA</th>
                <th>CARGO</th>
                <th>NOMENCLATURA FUERA DE LA DIGIN</th>
              </tr>
            </thead>
            <tbody>
              {pase
                ?.slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .filter((pase) => pase.servidorPolicialId === servidor.id)
                .map((pase) => (
                  <tr key={pase.id}>
                    <td
                      style={{ border: "none", backgroundColor: "transparent" }}
                    >
                      {((new Date() - new Date(pase.createdAt) <
                        diasEdicion * 24 * 60 * 60 * 1000 &&
                        ((ultimoDesplazamiento &&
                          !ultimoDesplazamiento.fechaFinalización &&
                          ultimoDesplazamiento.unidad === userLoggued?.unidad &&
                          ultimoDesplazamiento.unidadSubzona ===
                            userLoggued?.unidadSubzona) ||
                          (ultimoDesplazamiento &&
                            ultimoDesplazamiento.fechaPresentacion &&
                            ultimoDesplazamiento.fechaFinalización &&
                            ultimoDesplazamiento.unidadSubzona !==
                              userLoggued?.unidadSubzona) ||
                          (ultimoDesplazamiento &&
                            ultimoDesplazamiento.fechaPresentacion &&
                            ultimoDesplazamiento.fechaFinalización &&
                            ultimoDesplazamiento.unidadSubzona ===
                              userLoggued?.unidadSubzona &&
                            ultimoPase.unidadSubzona ===
                              userLoggued?.unidadSubzona) ||
                          !ultimoDesplazamiento ||
                          userLoggued?.tipoDesignacion === "NOPERA")) ||
                        userCI === superAdmin ||
                        ultimoDesplazamiento?.direccion === "OTROS") && (
                        <img
                          src="../../../edit.png"
                          className="btn__table"
                          onClick={() => handleEditPase(pase)}
                        />
                      )}

                      {userLoggued?.cI === superAdmin && (
                        <img
                          src="../../../delete.png"
                          className="btn__table"
                          onClick={() => handleHideDelete(pase)}
                        />
                      )}
                    </td>
                    <td className="table__td">{pase.numeroTelegrama}</td>
                    <td className="table__td">{pase.fechaTelegrama}</td>
                    <td className="table__td">{pase.direccion}</td>
                    <td className="table__td">{pase.unidad}</td>
                    <td className="table__td">{pase.nomenclatura}</td>
                    <td className="table__td">{pase.cargo}</td>
                    <td className="table__td">{pase.nomenclaturaNoDigin}</td>
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

export default Pases;
