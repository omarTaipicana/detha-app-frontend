import React, { useEffect, useState } from "react";
import "./styles/ChangePassword.css";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import IsLoading from "../shared/IsLoading";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/states/alert.slice";

const ChangePassword = () => {
  const { code: code } = useParams();
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const [, , verifyUser, , error, isLoading] =
    useAuth();

  useEffect(() => {
    if (error) {
      dispatch(
        showAlert({
          message: `⚠️ ${error.response?.data?.message}` || "Error inesperado",
          alertType: 1,
        })
      );
    }
  }, [error]);

  const submit = (data) => {
    if (data.password === data.confirmPassword) {
      const body = {
        password: data.password,
      };
      verifyUser(body, code);
      dispatch(
        showAlert({
          message: "⚠️ Su Contraseña se cambio Correctamente",
          alertType: 2,
        })
      );
    } else {
      dispatch(
        showAlert({
          message: "⚠️ Sus contraseñas no Coinciden",
          alertType: 1,
        })
      );
    }
    reset({
      password: "",
      confirmPassword: "",
    });
  };

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, [code]);

  return (
    <div>
      {isLoading && <IsLoading />}
      <div className="change__password__card">
        <h2 className="title__change__password__card">Cambie su Contraseña</h2>
        <form
          className="change__password__form"
          onSubmit={handleSubmit(submit)}
        >
          <label className="label__change__password__card">
            <span className="span__change__password__card">
              Escriba su nueva Contraseña
            </span>
            <input
              className="input__change__password__card"
              type="password"
              required
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$"
              title="La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número, un símbolo y tener al menos 8 caracteres."
              {...register("password")}
            />
          </label>
          <label className="label__change__password__card">
            <span className="span__change__password__card">
              Valide su Contraseña
            </span>
            <input
              className="input__change__password__card"
              type="password"
              required
              {...register("confirmPassword")}
            />
          </label>
          <button className="change__password__card__btn">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
