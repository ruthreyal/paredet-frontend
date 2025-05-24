import React from "react";

const Alerta = ({ mensaje, tipo = "info" }) => {
  if (!mensaje) return null;

  const clase = tipo === "error"
    ? "alerta-error"
    : tipo === "success"
    ? "alerta-exito"
    : "alerta-clara";

  return (
    <div className={`${clase} mt-3`} role="status" aria-live="polite">
      {mensaje}
    </div>
  );
};

export default Alerta;
