import { Outlet, Navigate } from "react-router-dom";

const SubAdminRoutes = () => {
  const user = JSON.parse(localStorage.user);
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;
  const rolSubAdmin = import.meta.env.VITE_ROL_SUB_ADMIN;

  if (
    user?.rol === rolAdmin ||
    user?.rol === rolSubAdmin ||
    user?.cI === superAdmin
  ) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default SubAdminRoutes;
