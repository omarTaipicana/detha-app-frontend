import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import PrincipalHeader from "./components/shared/PrincipalHeader";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import CreateUsers from "./pages/CreateUsers";
import HomePage from "./pages/HomePage";


function App() {
  return (
    <div>
      <PrincipalHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/reset_password/:code" element={<ChangePassword />} />
        <Route path="/create_users" element={<CreateUsers />} />
      </Routes>
    </div>
  );
}

export default App;
