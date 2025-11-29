import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import Promotion from "./pages/Promotion";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/promotion" element={<Promotion />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/promotion" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/promotion" replace />} />
      </Routes>
    </>
  );
}

export default App;
