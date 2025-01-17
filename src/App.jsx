import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import PrincipalHeader from "./components/shared/PrincipalHeader";
import HomePage from "./pages/HomePage";
import PageAdmin from "./pages/PageAdmin";
import AdminRoutes from "./components/controlRoutes/AdminRoutes";
import InactivePage from "./components/User/InactivePage";
import ServidoresPoliciales from "./pages/ServidoresPoliciales";
import ParteDiario from "./pages/ParteDiario";
import ProtectedRoutes from "./components/controlRoutes/ProtectedRoutes";
import UserActiveRoutes from "./components/controlRoutes/UserActiveRoutes";
import SubAdminRoutes from "./components/controlRoutes/SubAdminRoutes";
import ChangePassword from "./components/User/ChangePassword";
import ResetPassword from "./components/User/ResetPassword";
import Alert from "./components/shared/Alert";
import { UsersContent } from "./components/User/UsersContent";
import DireccionesUnidadesDetail from "./components/HomePage/DireccionesUnidadesDetail";

function App() {
  return (
    <div>
      <PrincipalHeader />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/reset_password/:code" element={<ChangePassword />} />
        
        {/* Rutas protegidas (usuario autenticado) */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/inactive" element={<InactivePage />} />

          {/* Rutas de usuario activo */}
          <Route element={<UserActiveRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/direcciones-unidades/:code" element={<DireccionesUnidadesDetail />} />
            <Route path="/servidores" element={<ServidoresPoliciales />} />
            <Route path="/partediario" element={<ParteDiario />} />

            {/* Rutas de subadmin */}
            <Route element={<SubAdminRoutes />}>
              <Route path="/create_users" element={<UsersContent />} />
              
              {/* Rutas de admin */}
              <Route element={<AdminRoutes />}>
                <Route path="/admin" element={<PageAdmin />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
      <Alert />
    </div>
  );
}

export default App;
