import { Outlet, Navigate } from "react-router-dom";

const SubAdminRoutes = () => {
  const user = JSON.parse(localStorage.user);

  if (
    user?.rol === "Administrador" ||
    user?.rol === "Sub-Administrador" ||
    user?.cI === "0503627234"
  ) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default SubAdminRoutes;
