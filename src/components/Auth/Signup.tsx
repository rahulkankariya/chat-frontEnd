import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import FormContainer from "../common/FormContainer";
import TextInput from "../common/input/TextInput";
import SubmitButton from "../common/button/SubmitButton";
import apiService from "../../services/apiService";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const passwordValue = watch("password");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setApiError(null);

    const { confirmPassword, ...payload } = data;

    const response = await apiService.post("/signup", payload);

    if (response.success) {
      navigate("/dashboard");
    } else {
        setApiError(response.message ?? "Signup failed")
    }
    setIsLoading(false);
  };

  return (
    <FormContainer title="Signup With Continue" error={apiError}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4"
      >
        <TextInput
          label="First Name"
          register={register("firstName", {
            required: "First Name is required",
          })}
          error={errors.firstName}
          disabled={isLoading}
        />
        <TextInput
          label="Last Name"
          register={register("lastName", {
            required: "Last Name is required",
          })}
          error={errors.lastName}
          disabled={isLoading}
        />
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
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          error={errors.password}
          disabled={isLoading}
          isPassword
        />
        <TextInput
          label="Confirm Password"
          register={register("confirmPassword", {
            required: "Confirm Password is required",
            validate: (value) =>
              value === passwordValue || "Passwords do not match",
          })}
          error={errors.confirmPassword}
          disabled={isLoading}
          isPassword
        />
        <SubmitButton
          label="Signup"
          loadingLabel="Signing up..."
          isLoading={isLoading}
        />
      </form>
      <div className="pt-3 ">
        Already have an account?
        <Link to="/login" className="font-bold cursor-pointer text-black pl-1 ">
          Login
        </Link>
      </div>
    </FormContainer>
  );
};

export default Signup;