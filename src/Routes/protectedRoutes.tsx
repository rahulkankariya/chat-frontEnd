// src/components/ProtectedRoute.tsx
import React, { useContext, useEffect, ReactNode, useRef } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextType";
import { fetchFcmToken, setupOnMessageListener } from "../firebase/fcmToken";
import { useToast } from "../components/common/toast/ToastContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const { showToast } = useToast();
  const hasFetchedToken = useRef(false);

  if (!authContext) {
    throw new Error("ProtectedRoute must be used within an AuthContext Provider");
  }

  const { token } = authContext;

  useEffect(() => {
    if (token && !hasFetchedToken.current) {
      hasFetchedToken.current = true;
      fetchFcmToken()
        .then((fcmToken) => {
          if (fcmToken) {
            console.log("FCM Token:", fcmToken);
          } else {
            showToast("error", "Notification permission denied");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch FCM token:", error);
        });
    }

    // Setup foreground message listener
    setupOnMessageListener((payload) => {
      console.log("Foreground Payload==>",payload)
      showToast("info", payload.notification?.message || "Notification received");
      console.log("Foreground message payload:", payload);
    });
  }, [token, showToast]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
