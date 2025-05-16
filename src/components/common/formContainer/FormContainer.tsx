import React from "react";
import { Paper, Typography } from "@mui/material";
import Logo from "../../Pages/logo"; // Adjust path as needed

interface FormContainerProps {
  title: string;
  error?: string | null;
  children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({
  title,
  error,
  children,
}) => {
  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{ backgroundColor: "#E5E7EB" }}
    >
      <div>
      <Logo />
      <Paper elevation={3} className="w-full max-w-md" style={{padding:"60px"}}>
        
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          color="#2b3d5f"
          fontWeight={700}
        >
          {title}
        </Typography>
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        {children}
      </Paper>
      </div>
     
    </div>
  );
};

export default FormContainer;