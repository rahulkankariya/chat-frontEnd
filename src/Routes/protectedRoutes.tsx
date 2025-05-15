import { Navigate } from "react-router-dom";
import { useContext, useEffect, ReactNode } from "react";
import { AuthContext } from "../context/AuthContextType";
import { fetchFcmToken } from "../firebase/fcmToken";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  // Check if context is undefined
  if (!authContext) {
    throw new Error("ProtectedRoute must be used within an AuthContext Provider");
  }

  const { token } = authContext;

  // Fetch FCM token when the component mounts and token exists
  useEffect(() => {
    if (token) {
      const getFcmToken = async () => {
        try {
          const fcmToken = await fetchFcmToken();
          if (fcmToken) {
            console.log("FCM Token:", fcmToken);
            // Optionally send token to backend
            // await fetch('/api/save-fcm-token', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //     Authorization: `Bearer ${token}`,
            //   },
            //   body: JSON.stringify({ fcmToken }),
            // });
          } else {
            console.log("No FCM token received (e.g., permission denied)");
          }
        } catch (error) {
          console.error("Failed to fetch FCM token:", error);
        }
      };
      getFcmToken();
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;