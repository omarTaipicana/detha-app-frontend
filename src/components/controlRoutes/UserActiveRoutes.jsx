import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";

const UserActiveRoutes = () => {
  const superAdmin = import.meta.env.VITE_CI_SUPERADMIN;
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;
  const rolSubAdmin = import.meta.env.VITE_ROL_SUB_ADMIN;
  const [, , , , , , , , , , , getUserLogged, user] = useAuth();

  useEffect(() => {
    getUserLogged();
  }, []);

  if (user) {
    if (
      user?.enabled === true ||
      user?.rol === rolAdmin ||
      user?.rol === rolSubAdmin ||
      user?.cI === superAdmin
    ) {
      return <Outlet />;
    } else {
      return <Navigate to="/inactive" />;
    }
  }
};

export default UserActiveRoutes;
