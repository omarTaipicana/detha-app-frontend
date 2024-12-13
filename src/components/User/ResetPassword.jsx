import React, { useEffect, useState } from "react";
import "./styles/ResetPassword.css";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import IsLoading from "../../components/shared/IsLoading";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/states/alert.slice";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [, , , sendEmail, error, isLoading, , , , userResetPasword] = useAuth();

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

  useEffect(() => {
    if (userResetPasword) {
      dispatch(
        showAlert({
          message: `⚠️ Estimado ${userResetPasword?.firstName} ${userResetPasword?.lastName}, revisa tu correo ${userResetPasword?.email} para resetear tu contraseña`,
          alertType: 2,
        })
      );
      navigate("/login");
    }
  }, [userResetPasword]);

  const submit = (data) => {
    const frontBaseUrl = `${location.protocol}//${location.host}/#/reset_password`;
    const body = { ...data, frontBaseUrl };
    sendEmail(body);
    reset({
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div>
      {isLoading && <IsLoading />}
      <div className="send__email__card">
        <h2 className="title__send__email__card">Resetea tu Contraseña</h2>
        <form className="send__email__form" onSubmit={handleSubmit(submit)}>
          <label className="label__send__email__card">
            <span className="span__send__email__card">Email</span>
            <input
              className="input__send__email__card"
              {...register("email")}
              type="email"
            />
          </label>
          <button className="send__email__card__btn">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
