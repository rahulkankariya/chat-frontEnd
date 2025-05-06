import { Navigate } from "react-router-dom";
import { useContext, ReactNode } from "react"; // Correct import for ReactNode
import { AuthContext } from "../../App";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useContext(AuthContext)!;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;