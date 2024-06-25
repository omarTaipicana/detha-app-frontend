import { Outlet, Navigate } from "react-router-dom";

const UserActiveRoutes = () => {
  const user = JSON.parse(localStorage.user);

  if (
    user?.enabled === true ||
    user?.rol === "Administrador" ||
    user?.rol === "Sub-Administrador"||
    user?.cI === "0503627234"
  ) {
    return <Outlet />;
  } else {
    return <Navigate to="/inactive" />;
  }
};

export default UserActiveRoutes;
