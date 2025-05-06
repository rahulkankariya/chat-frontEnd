import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./components/Routes/protectedRoutes";
import routes from "./routes";
import Loader from "./components/Pages/loader";
import './App.css'
// Authentication context
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provide authentication state
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Handle redirects for authenticated users
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

// Main app
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AuthManager />
        <Suspense fallback={<div><Loader/></div>}>
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
    </AuthProvider>
  );
};

export default App;
export { AuthContext };