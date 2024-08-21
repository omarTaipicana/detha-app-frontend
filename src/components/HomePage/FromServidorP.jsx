import React, { useEffect, useState } from "react";
import "./style/FormServidorP.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import getConfigToken from "../../services/getConfigToken";
import useCrud from "../../hooks/useCrud";

const FromServidorP = () => {
  const userCI = JSON.parse(localStorage.user ? localStorage.user : 0).cI;
  const PATH = "/servidores";
  const { register, handleSubmit, reset } = useForm();
  const [response, getApi, postApi, deleteApi, updateApi, hasError, isLoading] =
    useCrud();
  const [userEdit, setUserEdit] = useState();
  const [formIsClouse, setFormIsClouse] = useState(true);
  const userRol = JSON.parse(localStorage.user).rol;
  const useCI = JSON.parse(localStorage.user).cI;

  const submit = (data) => {
    const body = {
      ...data,
      usuarioRegistro: userCI,
      usuarioEdición: userCI,
    };

    if (userEdit) {
      // updateUser(body, userEdit.id);
      setUserEdit();
    } else {
      postApi(PATH, body);
    }
    reset({
      cI: "",
      nombres: "",
      apellidos: "",
      fechaNacimiento: "",
      fechaIngreso: "",
      provinciaResidencia: "",
      cantonResidencia: "",
      direccionResidencia: "",
      estadoCivil: "",
      etnia: "",
      acreditado: "",
      alertaDiscapacidad: "",
      tipoDiscapacidad: "",
      porcentajeDiscapacidad: "",
      detalleDiscapacidad: "",
      alertaEnfermedadCatastrófica: "",
      detalleEnfermedad: "",
    });
    setFormIsClouse(true);
  };


  return (
    <div>
      <button
        onClick={() => {
          setFormIsClouse(false);
        }}
        className="cerate__servidor__btn"
      >
        + Registrar Servidor Policial
      </button>

      <div
        className={`form__container__servidor ${formIsClouse && "form__close"}`}
      >
        <form
          className="create__servidor__form"
          onSubmit={handleSubmit(submit)}
        >
          <h2 className="title__create__servidor__card">
            {userEdit
              ? "Actualice Informacióndel Servidor Policial"
              : "Registro de Servidor Policial"}
          </h2>
          <div
            onClick={() => {
              setFormIsClouse(true);
              setUserEdit();
              reset({
                cI: "",
                nombres: "",
                apellidos: "",
                fechaNacimiento: "",
                fechaIngreso: "",
                provinciaResidencia: "",
                cantonResidencia: "",
                direccionResidencia: "",
                estadoCivil: "",
                etnia: "",
                acreditado: "",
                alertaDiscapacidad: "",
                tipoDiscapacidad: "",
                porcentajeDiscapacidad: "",
                detalleDiscapacidad: "",
                alertaEnfermedadCatastrófica: "",
                detalleEnfermedad: "",
              });
            }}
            className="form__exit"
          >
            ❌
          </div>

          <section className="form__create__servidor__seccion__continer">
            <section className="form__create__servidor__seccion">
              <label
                style={{
                  display:
                    !userEdit ||
                    userRol === "Administrador" ||
                    useCI === "0503627234"
                      ? "flex"
                      : "none",
                }}
                className="label__create__servidor__card"
              >
                <span className="span__create__servidor__card">Cedula:</span>
                <input
                  className="input__create__servidor__card"
                  {...register("cI")}
                  type="text"
                  placeholder="Número de Cédula"
                  required
                />
              </label>
              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">Nombres:</span>
                <input
                  className="input__create__servidor__card"
                  {...register("nombres")}
                  type="text"
                  placeholder="Nombres"
                  required
                />
              </label>
              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">Apellidos:</span>
                <input
                  className="input__create__servidor__card"
                  {...register("apellidos")}
                  type="text"
                  placeholder="Apellidos"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Fecha de Nacimiento:
                </span>
                <input
                  className="input__create__servidor__card"
                  {...register("fechaNacimiento")}
                  type="date"
                  placeholder="Registre la Fecha de Nacimiento"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Fecha de Ingreso a la PPNN:
                </span>
                <input
                  className="input__create__servidor__card"
                  {...register("fechaIngreso")}
                  type="date"
                  placeholder="Registre la Fecha de Ingreso a la Institución"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">Provincia:</span>
                <input
                  className="input__create__servidor__card"
                  {...register("provinciaResidencia")}
                  type="text"
                  placeholder="Provincia donde Reside"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">Cantón:</span>
                <input
                  className="input__create__servidor__card"
                  {...register("cantonResidencia")}
                  type="text"
                  placeholder="Cantón donde Reside"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">Dirección:</span>
                <input
                  className="input__create__servidor__card"
                  {...register("direccionResidencia")}
                  type="text"
                  placeholder="Dirección domiciliaria"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Estado Civil:
                </span>
                <input
                  className="input__create__servidor__card"
                  {...register("estadoCivil")}
                  type="text"
                  placeholder="Estado Civil"
                  required
                />
              </label>
            </section>

            <section className="form__create__servidor__seccion">
              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">Etnia:</span>
                <input
                  className="input__create__servidor__card"
                  {...register("etnia")}
                  type="text"
                  placeholder="Etnia"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Acreditado:
                </span>
                <select
                  className="input__create__servidor__card"
                  {...register("acreditado")}
                  type="text"
                  placeholder="Acreditado"
                  required
                >
                  <option value="">Seleccione Si / No tiene Aceditación</option>
                  <option value="NO">NO</option>
                  <option value="SI">SI</option>
                </select>
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Alerta de Discapacidad:
                </span>
                <select
                  className="input__create__servidor__card"
                  {...register("alertaDiscapacidad")}
                  type="text"
                  placeholder="Alerta de Discapacidad"
                  required
                >
                  <option value="">
                    Seleccione Si / No tiene alerta de Discapacidad
                  </option>
                  <option value="NO">NO</option>
                  <option value="SI">SI</option>
                </select>
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Tipo de Discapacidad:
                </span>
                <input
                  className="input__create__servidor__card"
                  {...register("tipoDiscapacidad")}
                  type="text"
                  placeholder="Tipo de Discapacidad"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Porcentaje de Discapacidad:
                </span>
                <input
                  className="input__create__servidor__card"
                  {...register("porcentajeDiscapacidad")}
                  type="number"
                  placeholder="Porcentaje de Discapacidad"
                  step="0.01"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Detalle de Discapacidad:
                </span>
                <input
                  className="input__create__servidor__card"
                  {...register("detalleDiscapacidad")}
                  type="text"
                  placeholder="Detalle de Discapacidad"
                  required
                />
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Alerta de Enfermedad Catastrófica:
                </span>
                <select
                  className="input__create__servidor__card"
                  {...register("alertaEnfermedadCatastrófica")}
                  type="text"
                  placeholder="Alerta de Enfermedad Catastrófica"
                  required
                >
                  <option value="">
                    Seleccione Si / No tiene alerta de Enfermedad Catastrófica
                  </option>
                  <option value="NO">NO</option>
                  <option value="SI">SI</option>
                </select>
              </label>

              <label className="label__create__servidor__card">
                <span className="span__create__servidor__card">
                  Detalle de Enfermedad Catastrófica:
                </span>
                <input
                  className="input__create__servidor__card"
                  {...register("detalleEnfermedad")}
                  type="text"
                  placeholder="Detalle de Enfermedad Catastrófica"
                  required
                />
              </label>
            </section>
          </section>
          <button className="create__servidor__card__btn">
            {userEdit ? "ACTUALIZAR" : "GUARDAR"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FromServidorP;
