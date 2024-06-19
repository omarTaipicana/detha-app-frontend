import axios from "axios";
import { useNavigate } from "react-router-dom";

const urlBase = "https://detha-app-backend.onrender.com";

const useAuth = () => {
  const navigate = useNavigate();

  const registerUser = (data) => {
    const url = `${urlBase}/users`;
    axios
      .post(url, data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  const loginUser = (data) => {
    const url = `${urlBase}/users/login`;
    axios
      .post(url, data)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  };

  const verifyUser = (data, code) => {
    const url = `${urlBase}/users/reset_password/${code}`;
    axios
      .post(url, data)
      .then((res) => {
        console.log(res.data);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendEmail = (data) => {
    const url = `${urlBase}/users/reset_password`;
    axios
      .post(url, data)
      .then((res) => {
        console.log(res.data);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return [registerUser, loginUser, verifyUser, sendEmail];
};

export default useAuth;
