import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import getConfigToken from "../services/getConfigToken";

const useAuth = () => {
  const urlBase = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState();
  const [handleRes, setHandleRes] = useState();

  const registerUser = (data) => {
    setIsLoading(true);
    const url = `${urlBase}/users`;
    axios
      .post(url, data, getConfigToken())
      .then((res) => {
        // console.log(res.data);
        // setUsers(res.data);
        setHandleRes(res.data);
      })
      .catch((error) => {
        // console.log(error);
        setError(error);
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
        // navigate("/");
      })
      .catch((error) => {
        setError(error);
        // console.log(err);
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
        setHandleRes(res.data);
        // console.log(res.data);
        navigate("/login");
      })
      .catch((error) => {
        // console.log(error);
        setError(error);
      })
      .finally(() => setIsLoading(false));
  };

  const sendEmail = (data) => {
    setIsLoading(true);
    const url = `${urlBase}/users/reset_password`;
    axios
      .post(url, data)
      .then((res) => {
        // console.log(res.data);
        setHandleRes(res.data);
        // navigate("/login");
      })
      .catch((error) => {
        // console.log(error);
        setError(error);
      })
      .finally(() => setIsLoading(false));
  };

  const getUsers = () => {
    setIsLoading(true);
    const url = `${urlBase}/users`;
    axios
      .get(url, getConfigToken())
      .then((res) => setUsers(res.data))
      .catch((error) => {
        setError(error);
        console.log(error);
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
        setHandleRes(res.data);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      })
      .finally(() => setIsLoading(false));
  };

  const deleteUser = ( id) => {
    setIsLoading(true);
    const url = `${urlBase}/users/${id}`;
    axios
      .delete(url,  getConfigToken())
      .then((res) => {
        // console.log(res.data);
        setHandleRes(res.data);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      })
      .finally(() => setIsLoading(false));
  };

  return [
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
  ];
};

export default useAuth;
