import React from "react";
import { Button } from "@mui/material";

interface SubmitButtonProps {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  loadingLabel,
  isLoading,
  disabled,
}) => {
  return (
    <Button
      type="submit"
      variant="contained"
      fullWidth
      style={{ backgroundColor: "black", color: "white" }}
      disabled={isLoading || disabled}
    >
      {isLoading ? loadingLabel : label}
    </Button>
  );
};

export default SubmitButton;