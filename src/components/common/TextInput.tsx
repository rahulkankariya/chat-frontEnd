import React, { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface TextInputProps {
  label: string;
  type?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  disabled?: boolean;
  isPassword?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  type = "text",
  register,
  error,
  disabled,
  isPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      label={label}
      type={isPassword && !showPassword ? "password" : type}
      variant="outlined"
      fullWidth
      {...register}
      error={!!error}
      helperText={error?.message}
      disabled={disabled}
      InputProps={
        isPassword
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    edge="end"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={disabled}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : undefined
      }
    />
  );
};

export default TextInput;