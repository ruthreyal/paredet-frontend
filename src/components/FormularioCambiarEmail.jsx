import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/apiConfig";
import Alerta from "./Alerta";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const FormularioCambiarEmail = ({ emailActual, token }) => {
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const { logout } = useContext(AuthContext);

  const mostrarMensaje = (texto, tipo = "info") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nuevoEmail || !password) {
      return mostrarMensaje(
        "Completa ambos campos para cambiar el email.",
        "error"
      );
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/usuarios/email-existe`,
        {
          params: { email: nuevoEmail },
        }
      );

      if (response.data === true) {
        return mostrarMensaje("Ese email ya está en uso.", "error");
      }
    } catch {
      return mostrarMensaje("Error al comprobar el email.", "error");
    }

    try {
      await axios.put(
        `${API_BASE_URL}/usuarios/cambiar-email`,
        {
          emailActual,
          nuevoEmail,
          password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(
        "Email actualizado correctamente. Por favor, vuelve a iniciar sesión con tu nuevo email."
      );
      logout();
    } catch (err) {
      const mensajeError = err.response?.data || "Error al cambiar el email.";
      mostrarMensaje(mensajeError, "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3"
      aria-label="Formulario para cambiar email"
      id="form-cambiar-email"
    >
      <div className="mb-3">
        <label htmlFor="nuevoEmail" className="form-label">
          Nuevo Email
        </label>
        <input
          type="email"
          className="form-control"
          id="nuevoEmail"
          name="nuevoEmail"
          value={nuevoEmail}
          onChange={(e) => setNuevoEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Contraseña actual
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <button type="submit" className="btn btn-gold w-100">
        Guardar nuevo email
      </button>

      <Alerta mensaje={mensaje} tipo={tipoMensaje} />
    </form>
  );
};

export default FormularioCambiarEmail;
