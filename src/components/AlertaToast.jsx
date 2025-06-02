import React, { useEffect } from "react";
import "../styles/utils.css";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

const AlertaToast = ({
  mostrar,
  onCerrar,
  titulo = "Aviso",
  mensaje,
  tipo = "info",
  autoCerrar = true,
  duracion = 4000,
}) => {
  useEffect(() => {
    if (mostrar && autoCerrar) {
      const timer = setTimeout(() => {
        onCerrar();
      }, duracion);
      return () => clearTimeout(timer);
    }
  }, [mostrar, autoCerrar, duracion, onCerrar]);

  if (!mostrar) return null;

  let clase = "";
  switch (tipo) {
    case "elegante":
      clase = "alerta-elegante";
      break;
    case "error":
      clase = "alerta-error";
      break;
    case "info":
    default:
      clase = "alerta-info";
  }

  return (
    <div
      className="position-fixed top-0 start-50 translate-middle-x p-3"
      style={{ zIndex: 1055, top: "2rem" }}
    >
      <div className={`toast show ${clase}`} role="alert" aria-atomic="true">
        <div className="d-flex align-items-center gap-2">
          {tipo === "elegante" && (
            <FaCheckCircle style={{ color: "var(--color-principal)", fontSize: "1.3rem" }} />
          )}
          {tipo === "error" && (
            <FaTimesCircle style={{ color: "#dc3545", fontSize: "1.3rem" }} />
          )}
          {tipo === "info" && (
            <FaInfoCircle style={{ color: "var(--color-principal)", fontSize: "1.3rem" }} />
          )}
          <span>{mensaje}</span>
        </div>
      </div>
    </div>
  );
};

export default AlertaToast;

