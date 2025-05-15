import { Navigate } from "react-router-dom";
import { useContext, useEffect, ReactNode, useRef } from "react";
import { AuthContext } from "../context/AuthContextType";
import { fetchFcmToken } from "../firebase/fcmToken";
import { useToast } from "../components/common/toast/ToastContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const { showToast } = useToast();
  const hasFetchedToken = useRef(false); // Track if FCM token was fetched

  // Check if context is undefined
  if (!authContext) {
    throw new Error("ProtectedRoute must be used within an AuthContext Provider");
  }

  const { token } = authContext;

  // Fetch FCM token when the component mounts and token exists
  useEffect(() => {
    if (token && !hasFetchedToken.current) {
      hasFetchedToken.current = true; // Prevent re-fetching
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
            showToast(
              "error",
              "Notification permission denied"

            );
            console.log("No FCM token received (e.g., permission denied)");
          }
        } catch (error) {
          console.error("Failed to fetch FCM token:", error);
        }
      };
      getFcmToken();
    }
  }, [token, showToast]); // Include showToast in dependencies

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;