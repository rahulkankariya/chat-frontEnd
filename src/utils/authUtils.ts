export const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };
  
  export const redirectToLogin = () => {
    // Redirect to the login page and replace the history so back button doesn't go to the dashboard
    window.location.replace("/login");
  };
  
  export const redirectToDashboard = () => {
    // Redirect to the dashboard if the user is logged in
    window.location.replace("/dashboard");
  };
  
  export const protectRoute = () => {
    if (!isAuthenticated()) {
      redirectToLogin();
    }
  };
  
  export const handleAuthRedirect = (path: string) => {
    if (isAuthenticated()) {
      redirectToDashboard();
    } else {
      // Do nothing if the user is not authenticated
    }
  };
  