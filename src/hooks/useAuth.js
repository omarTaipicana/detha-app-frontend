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
  
  return [registerUser, loginUser];
};

export default useAuth;
