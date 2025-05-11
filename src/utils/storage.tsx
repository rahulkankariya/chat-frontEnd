// storage.ts
export const saveUserToStorage = (token: string, user: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("firstName", user.firstName || "");
    localStorage.setItem("lastName", user.lastName || "");
    localStorage.setItem("userName", user.userName || "");
    localStorage.setItem("avtar", user.avatar_url || "");
  };
  export const getUserFromStorage = () => {
    return {
      token: localStorage.getItem("token") || "",
      firstName: localStorage.getItem("firstName") || "",
      lastName: localStorage.getItem("lastName") || "",
      userName: localStorage.getItem("userName") || "",
      avatar: localStorage.getItem("avtar") || "",
    };
  };