import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Promotion from "./pages/Promotion";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
    return(
        <>
            <Routes>
                <Route
                    path='/login'
                    element={ <LoginPage/> }
                />
                <Route
                    path='/forgot-password'
                    element={ <ForgotPasswordPage/> }
                />
                <Route
                    path='/reset-password'
                    element={ <ResetPasswordPage/> }
                />
                <Route element={<ProtectedRoute/>}>
                    <Route
                        path="/promotion"
                        element={<Promotion />}
                    />

                    <Route
                        path="/"
                        element={<Navigate to="/promotion" replace />}
                    />
                </Route>
                <Route path="*" element={<Navigate to="/promotion" replace />} />
            </Routes>
        </>
    );
}

export default App;