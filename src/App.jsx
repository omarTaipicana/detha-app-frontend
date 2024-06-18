import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import PrincipalHeader from "./components/shared/PrincipalHeader";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <div>
      <PrincipalHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/reset_password/:code" element={<ChangePassword />} />
      </Routes>
    </div>
  );
}

export default App;
