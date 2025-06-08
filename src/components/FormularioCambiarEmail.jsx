import React, { useState, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/apiConfig";
import { AuthContext } from "../context/AuthContext";
import registroService from "../services/registroService";
import { FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import AlertaToast from "./AlertaToast";

const FormularioCambiarEmail = ({ emailActual }) => {
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { logout } = useContext(AuthContext);

  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "info",
  });

  const mostrarToast = (mensaje, tipo = "info") => {
    setToast({ mostrar: true, mensaje, tipo });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, mostrar: false }));
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};
    const token = localStorage.getItem("token");

    if (!nuevoEmail.trim()) {
      nuevosErrores.nuevoEmail = "El nuevo email es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(nuevoEmail)) {
      nuevosErrores.nuevoEmail = "Introduce un email válido.";
    }

    if (!password.trim()) {
      nuevosErrores.password = "La contraseña actual es obligatoria.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    try {
      const yaExiste = await registroService.emailExiste(nuevoEmail);
      if (yaExiste) {
        setErrors({ nuevoEmail: "El nuevo email ya está registrado." });
        return;
      }

      const res = await axios.put(
        `${API_BASE_URL}/usuarios/cambiar-email`,
        { emailActual, nuevoEmail, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      mostrarToast(res.data, "success");
      setNuevoEmail("");
      setPassword("");
      setErrors({});

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

      setErrors({ password: errorMsg });
    }
  };

  return (
    <section className="mb-4" aria-label="Formulario para cambiar el email">
      <AlertaToast
        mostrar={toast.mostrar}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
        titulo="Notificación"
        mensaje={toast.mensaje}
        tipo={toast.tipo}
      />

      <h5 className="mb-3">Cambiar email</h5>

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
          {errors.nuevoEmail && (
            <div className="form-error" role="alert">
              <FaExclamationCircle className="icono-error" />
              {errors.nuevoEmail}
            </div>
          )}
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
                if (e.key === "Enter" || e.key === " ")
                  setVerPassword(!verPassword);
              }}
              className="eye-icon"
            >
              {verPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && (
            <div className="form-error" role="alert">
              <FaExclamationCircle className="icono-error" />
              {errors.password}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Actualizar email
        </button>
      </form>
    </section>
  );
};

export default FormularioCambiarEmail;
