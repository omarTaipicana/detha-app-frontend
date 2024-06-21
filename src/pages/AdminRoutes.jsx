import { Outlet, Navigate } from "react-router-dom";

const AdminRoutes = () => {
  const user = JSON.parse(localStorage.user);

  if (user?.rol === "Administrador") {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default AdminRoutes;
