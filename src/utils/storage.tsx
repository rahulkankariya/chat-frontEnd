// storage.ts
export const saveUserToStorage = (token: string, user: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("firstName", user.firstName || "");
    localStorage.setItem("lastName", user.lastName || "");
    localStorage.setItem("userName", user.userName || "");
    localStorage.setItem("avtar", user.avtar || "");
  };
