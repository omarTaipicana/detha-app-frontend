import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import PrincipalHeader from "./components/shared/PrincipalHeader";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import CreateUsers from "./pages/CreateUsers";
import HomePage from "./pages/HomePage";
import PageAdmin from "./pages/PageAdmin";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import AdminRoutes from "./pages/AdminRoutes";
import SubAdminRoutes from "./pages/SubAdminRoutes";
import UserActiveRoutes from "./pages/UserActiveRoutes";
import InactivePage from "./pages/InactivePage";
import ServidoresPoliciales from "./pages/ServidoresPoliciales";
import ParteDiario from "./pages/ParteDiario";

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
              <Route path="/create_users" element={<CreateUsers />} />

              <Route element={<AdminRoutes />}>
                <Route path="/admin" element={<PageAdmin />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
