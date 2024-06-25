import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import getConfigToken from "../services/getConfigToken";

const useAuth = () => {
  // const urlBase = "http://localhost:8080";
  const urlBase = "https://detha-app-backend.onrender.com";
  const navigate = useNavigate();
  const [err, setErr] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState();

  const registerUser = (data) => {
    setIsLoading(true);
    const url = `${urlBase}/users`;
    axios
      .post(url, data, getConfigToken())
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
        setErr(res.data);
      })
      .catch((err) => {
        console.log(err);
        setErr(err);
      })
      .finally(() => setIsLoading(false));
  };

  const loginUser = (data) => {
    setIsLoading(true);
    const url = `${urlBase}/users/login`;
    axios
      .post(url, data)
      .then((res) => {
        // console.log(res.data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      })
      .catch((err) => {
        setErr(err);
        console.log(err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .finally(() => setIsLoading(false));
  };

  const verifyUser = (data, code) => {
    setIsLoading(true);
    const url = `${urlBase}/users/reset_password/${code}`;
    axios
      .post(url, data)
      .then((res) => {
        console.log(res.data);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        setErr(err);
      })
      .finally(() => setIsLoading(false));
  };

  const sendEmail = (data) => {
    setIsLoading(true);
    const url = `${urlBase}/users/reset_password`;
    axios
      .post(url, data)
      .then((res) => {
        console.log(res.data);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        setErr(err);
      })
      .finally(() => setIsLoading(false));
  };

  const getUsers = () => {
    setIsLoading(true);
    const url = `${urlBase}/users`;
    axios
      .get(url, getConfigToken())
      .then((res) => setUsers(res.data))
      .catch((err) => {
        setErr(err);
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const updateUser = (data, id) => {
    setIsLoading(true);
    const url = `${urlBase}/users/${id}`;
    axios
      .put(url, data, getConfigToken())
      .then((res) => {
        // console.log(res.data);
        setUsers(res.data);
        setErr();
      })
      .catch((err) => {
        console.log(err);
        setErr(err);
      })
      .finally(() => setIsLoading(false));
  };

  return [
    registerUser,
    loginUser,
    verifyUser,
    sendEmail,
    err,
    isLoading,
    users,
    getUsers,
    updateUser
  ];
};

export default useAuth;
