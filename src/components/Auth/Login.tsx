// src/components/Login.tsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import FormContainer from "../common/FormContainer";
import TextInput from "../common/TextInput";
import SubmitButton from "../common/SubmitButton";
import apiService from "../../services/apiService";
import { LoginResponse } from "../../interface/auth";
import {saveUserToStorage} from "../../utils/storage";

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

    try {
      const response = await apiService.post<LoginResponse>("/login", data);

      if (response.success && response.data?.token && response.data?.userDetails) {
        saveUserToStorage(response.data.token, response.data.userDetails);
        navigate("/dashboard");
      } else {
        setApiError(response.message ?? "Login failed");
      }
    } catch (error: any) {
      setApiError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer title="Sign In to Continue" error={apiError}>
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

      <div className="pt-3 text-sm text-gray-600">
        Don’t have an account?
        <Link to="/signup" className="font-bold text-black pl-1">
          Sign up
        </Link>
      </div>
    </FormContainer>
  );
};

export default Login;
