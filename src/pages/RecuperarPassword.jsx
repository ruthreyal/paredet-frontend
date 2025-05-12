import React, { useState } from "react";
import authService from "../services/authService";

const RecuperarPassword = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.solicitarRecuperacion(email);
      setMensaje("Si el email está registrado, recibirás un enlace para restablecer tu contraseña.");
    } catch (error) {
      console.error("Error al solicitar recuperación:", error);
      setMensaje("Ha ocurrido un error.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Recuperar contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="btn btn-outline-dark" type="submit">Enviar enlace</button>
      </form>
      {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
    </div>
  );
};

export default RecuperarPassword;
