// src/components/Login.tsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import FormContainer from "../common/FormContainer";
import TextInput from "../common/TextInput";
import SubmitButton from "../common/SubmitButton";
import apiService from "../../services/apiService";
import { LoginResponse } from "../../interface/auth";

type FormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setApiError(null);

    const response = await apiService.post<LoginResponse>("/login", data); // Specify LoginResponse type here

    if (response.success) {
      const token = response.data?.token; // Safe to access 'token'
      const user = response.data?.userDetails;   // Safe to access 'user'
      // console.log("user=?",response?.data)
      if (token) {
        localStorage.setItem("token", token);
        if (user) {
          localStorage.setItem("firstName",user?.firstName || "");
          localStorage.setItem("lastName",user?.lastName|| ""); // Store user object as a string
        }
     // Store token in localStorage
        navigate("/dashboard");
      } else {
        setApiError("Token not received.");
      }
    } else {
      setApiError(response.message ?? "Login failed");
    }

    setIsLoading(false);
  };

  return (
    <div>
      <FormContainer title="Sign With Continue" error={apiError}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <TextInput
            label="Email"
            register={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Enter a valid email",
              },
            })}
            error={errors.email}
            disabled={isLoading}
          />
          <TextInput
            label="Password"
            register={register("password", {
              required: "Password is required",
            })}
            error={errors.password}
            disabled={isLoading}
            isPassword
          />
          <SubmitButton
            label="Login"
            loadingLabel="Logging in..."
            isLoading={isLoading}
          />
        </form>
        <div className="pt-3">
          Don’t have an account?
          <Link to="/signup" className="font-bold cursor-pointer text-black pl-1">
            Signup
          </Link>
        </div>
      </FormContainer>
    </div>
  );
};

export default Login;
