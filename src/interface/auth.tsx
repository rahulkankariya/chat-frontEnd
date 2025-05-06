// src/interfaces/auth.ts
export interface userDetails {
    id: number;
    firstName: string;
    lastName: string;
  }
  
  export interface LoginResponse {
    token: string;
    userDetails: userDetails;
  }
  