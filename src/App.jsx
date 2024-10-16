import { Route, Routes } from "react-router-dom";
import "./App.css";
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

function App() {
  return (
    <div>
      <PrincipalHeader />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/reset_password/:code" element={<ChangePassword />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/inactive" element={<InactivePage />} />

          <Route element={<UserActiveRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/servidores" element={<ServidoresPoliciales />} />
            <Route path="/partediario" element={<ParteDiario />} />

            <Route element={<SubAdminRoutes />}>
              <Route path="/create_users" element={<UsersContent />} />

              <Route element={<AdminRoutes />}>
                <Route path="/admin" element={<PageAdmin />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
      <Alert/>
    </div>
  );
}

export default App;
