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
  onAceptar,
  onCancelar,
  mostrarBotones = false,
}) => {
  useEffect(() => {
    if (mostrar && autoCerrar && !mostrarBotones) {
      const timer = setTimeout(() => {
        onCerrar();
      }, duracion);
      return () => clearTimeout(timer);
    }
  }, [mostrar, autoCerrar, duracion, onCerrar, mostrarBotones]);

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
      <div
        className={`${
          autoCerrar && !mostrarBotones ? "toast show" : "custom-toast"
        } ${clase}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex flex-column">
          <div className="d-flex align-items-center gap-2">
            {tipo === "elegante" && (
              <FaCheckCircle
                style={{
                  color: "var(--color-principal)",
                  fontSize: "3rem",
                  padding: "3px",
                  textAlign: "center",
                }}
              />
            )}
            {tipo === "error" && (
              <FaTimesCircle
                style={{
                  color: "#dc3545",
                  fontSize: "3rem",
                  padding: "3px",
                  textAlign: "center",
                }}
              />
            )}
            {tipo === "info" && (
              <FaInfoCircle
                style={{
                  color: "var(--color-principal)",
                  fontSize: "1.5rem",
                  padding: "3px",
                  textAlign: "center",
                }}
              />
            )}
            <span>{mensaje}</span>
          </div>

          {mostrarBotones && (
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-outline-dark" onClick={onAceptar}>
                Sí
              </button>
              <button className="btn btn-dark" onClick={onCancelar}>
                No
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertaToast;
