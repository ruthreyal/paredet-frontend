import React, { useState, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/apiConfig";
import { AuthContext } from "../context/AuthContext";
import registroService from "../services/registroService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/formularios.css";

const FormularioCambiarEmail = ({ emailActual }) => {
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [mostrarModal, setMostrarModal] = useState(false);
  const { logout } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const yaExiste = await registroService.emailExiste(nuevoEmail);
      if (yaExiste) {
        setMensaje("El nuevo email ya está registrado.");
        setTipoMensaje("error");
        setMostrarModal(true);
        return;
      }

      const res = await axios.put(
        `${API_BASE_URL}/usuarios/cambiar-email`,
        { emailActual, nuevoEmail, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje(res.data);
      setTipoMensaje("success");
      setMostrarModal(true);

      setTimeout(() => {
        logout();
      }, 3000);
    } catch (err) {
      const errorMsg = (() => {
        const data = err.response?.data;
        if (typeof data === "string") return data;
        if (typeof data === "object" && data?.mensaje) return data.mensaje;
        return "Error al actualizar el email.";
      })();

      setMensaje(errorMsg);
      setTipoMensaje("error");
      setMostrarModal(true);
    }
  };

  return (
    <section className="mb-4" aria-label="Formulario para cambiar el email">

      <h3 className="mb-3">Cambiar email</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nuevoEmail">Nuevo email</label>
          <input
            id="nuevoEmail"
            name="nuevoEmail"
            type="email"
            className="input-field"
            value={nuevoEmail}
            onChange={(e) => setNuevoEmail(e.target.value)}
            required
            aria-required="true"
            aria-label="Introduce tu nuevo email"
          />
        </div>

        <div className="mb-3 position-relative">
          <label htmlFor="password">Contraseña actual</label>
          <div className="input-icon-wrapper">
            <input
              id="password"
              name="password"
              type={verPassword ? "text" : "password"}
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
              aria-label="Introduce tu contraseña actual"
            />
            <span
              onClick={() => setVerPassword(!verPassword)}
              aria-label="Mostrar u ocultar contraseña"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setVerPassword(!verPassword);
              }}
              className="eye-icon"
            >
              {verPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

       <button type="submit" className="btn btn-dark w-100">
          Actualizar email
        </button>
      </form>

      {mostrarModal && (
        <div
          className="modal-overlay"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="mensaje-cambio-email"
        >
          <div className="modal-contenido">
            <p
              id="mensaje-cambio-email"
              className={`alerta-${tipoMensaje}`}
            >
              {mensaje}
            </p>
            <button
              onClick={() => setMostrarModal(false)}
              aria-label="Cerrar aviso"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default FormularioCambiarEmail;


