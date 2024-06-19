import { Outlet, Navigate } from "react-router-dom";
import HomePage from "./Login";

const ProtectedRoutes = () => {
  if (localStorage.getItem("token")) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;
