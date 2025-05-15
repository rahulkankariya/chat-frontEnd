// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useContext, useEffect, Suspense } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContextType";
import ProtectedRoute from "./Routes/protectedRoutes";
import routes from "./Routes/routes";
import Loader from "./components/Pages/loader";
import { SocketProvider } from "./socket/SocketContext";
import "./App.css";
import { ToastProvider } from "./components/common/toast/ToastContext";

const AuthManager: React.FC = () => {
  const { setToken } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (storedToken && location.pathname === "/login") {
      navigate("/dashboard", { replace: true });
    }
  }, [location, navigate, setToken]);

  return null;
};

const App: React.FC = () => {
  return (
    <ToastProvider>
       <AuthProvider>
      <SocketProvider>
        <Router>
          <AuthManager />
          <Suspense fallback={<div><Loader /></div>}>
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    route.protected ? (
                      <ProtectedRoute>{route.element}</ProtectedRoute>
                    ) : (
                      route.element
                    )
                  }
                />
              ))}
              <Route
                path="*"
                element={<Navigate to={localStorage.getItem("token") ? "/dashboard" : "/login"} replace />}
              />
            </Routes>
          </Suspense>
        </Router>
      </SocketProvider>
    </AuthProvider>
      </ToastProvider>
   
  );
};

export default App;
