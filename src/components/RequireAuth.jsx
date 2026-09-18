import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

const RequireAuth = ({ children }) => {
  const location = useLocation();

  if (!getCurrentUser()) {
    return <Navigate to="/login-registration" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
