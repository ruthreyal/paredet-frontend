import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const PrivateRouteAdmin = () => {
  const { usuario } = useContext(AuthContext);
  return usuario?.rol === "ADMIN" ? <Outlet /> : <Navigate to="/" />;
};
