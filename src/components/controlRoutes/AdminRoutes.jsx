import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";

const AdminRoutes = () => {
  const [, , , , , , , , , , , getUserLogged, user] = useAuth();
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;

  useEffect(() => {
    getUserLogged();
  }, []);

  if (user) {
    if (user?.rol === rolAdmin || user?.cI === superAdmin) {
      return <Outlet />;
    } else {
      return <Navigate to="/" />;
    }
  }
};

export default AdminRoutes;
