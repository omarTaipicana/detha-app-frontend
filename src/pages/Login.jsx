import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Login.css";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import IsLoading from "../components/shared/IsLoading";
import { useDispatch } from "react-redux";
import { showAlert } from "../store/states/alert.slice";

const HomePage = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const dispatch = useDispatch();
  const [prevUser, setPrevUser] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const [, loginUser, , , error, isLoading] = useAuth();
  const navigate = useNavigate();

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
    if (user && prevUser === null) {
      dispatch(
        showAlert({
          message: `⚠️ Bienvenido ${user?.firstName} ${user?.lastName} a al App Web DETHA`,
          alertType: 2,
        })
      );
      setPrevUser(user);
      navigate("/");
    }
  }, [user, prevUser, dispatch]);

  const submit = (data) => {
    loginUser(data);
    reset({
      cI: "",
      password: "",
    });
  };

  return (
    <div>
      {isLoading && <IsLoading />}
      <div className="login__card">
        <h2 className="title__login__card">SECCIÓN DE TALENTO HUMANO</h2>
        <form className="login__form" onSubmit={handleSubmit(submit)}>
          <label className="label__login__card">
            <span className="span__login__card">Usuario</span>
            <input
              className="input__login__card"
              {...register("cI")}
              type="text"
            />
          </label>
          <label className="label__login__card">
            <span className="span__login__card">Contraseña</span>
            <input
              className="input__login__card"
              {...register("password")}
              type="password"
            />
          </label>

          <Link to="/reset_password">Olvido su contraseña</Link>
          <button className="login__card__btn">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
