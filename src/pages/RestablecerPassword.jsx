import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../services/authService";

const RestablecerPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [token, setToken] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get("token");
    if (!tokenParam) {
      setMensaje("Token inválido.");
    } else {
      setToken(tokenParam);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmar) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    try {
      await authService.restablecerPassword(token, password);
      setMensaje("Contraseña actualizada correctamente.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      setMensaje("El enlace ha expirado o el token no es válido.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Establecer nueva contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nueva contraseña</label>
          <input
            type="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            className="form-control"
            required
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />
        </div>
        <button className="btn btn-outline-dark" type="submit">
          Guardar nueva contraseña
        </button>
      </form>
      {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
    </div>
  );
};

export default RestablecerPassword;
