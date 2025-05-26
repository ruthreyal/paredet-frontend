import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const PrivateRouteAdmin = () => {
  const { usuario } = useContext(AuthContext);

  // Solo se bloquean usuarios no logueados o no admin
  if (!usuario) return <Navigate to="/" />;
  if (usuario.rolNombre !== "ADMIN") return <Navigate to="/" />;

  return <Outlet />;
};

