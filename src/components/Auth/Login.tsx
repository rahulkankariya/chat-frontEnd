import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import FormContainer from "../common/FormContainer";
import TextInput from "../common/TextInput";
import SubmitButton from "../common/SubmitButton";
import apiService from "../../services/apiService";

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

    const response = await apiService.post("/api/login", data);

    if (response.success) {
      navigate("/dashboard");
    } else {
      setApiError(response.message ?? "Login failed");
    }
    setIsLoading(false);
  };

  return (
    <div>
<FormContainer title="Sign With Continue" error={apiError}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4"
      >
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