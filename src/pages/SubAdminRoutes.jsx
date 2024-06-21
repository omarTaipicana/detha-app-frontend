import { Outlet, Navigate } from "react-router-dom";

const SubAdminRoutes = () => {
  const user = JSON.parse(localStorage.user);

  if (user?.rol === "Administrador" || user?.rol === "Sub-Administrador") {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default SubAdminRoutes;
