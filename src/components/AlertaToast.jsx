import React from "react";
import { Link } from "react-router-dom";

const AlertaToast = ({ mostrar, onCerrar, titulo = "Aviso", mensaje }) => {
  if (!mostrar) return null;

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      role="status"
      aria-live="polite"
    >
      <div className="toast show" role="alert" aria-atomic="true">
        <div className="toast-header">
          <strong className="me-auto">{titulo}</strong>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar"
            onClick={onCerrar}
          ></button>
        </div>
        <div className="toast-body">{mensaje}</div>
      </div>
    </div>
  );
};

export default AlertaToast;
