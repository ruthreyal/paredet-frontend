import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const FormularioCambiarContraseña = ({
  contrasenaActual,
  nuevaPassword,
  verActual,
  setVerActual,
  verNueva,
  setVerNueva,
  handleChange,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <h5 className="mb-3">Cambiar contraseña</h5>

      <div className="mb-3 position-relative">
        <label htmlFor="contrasenaActual">Contraseña actual</label>
        <div className="input-icon-wrapper">
          <input
            id="contrasenaActual"
            name="contrasenaActual"
            type={verActual ? "text" : "password"}
            className="input-field"
            required
            value={contrasenaActual}
            onChange={handleChange}
          />
          <span
            onClick={() => setVerActual(!verActual)}
            aria-label="Mostrar u ocultar contraseña actual"
          >
            {verActual ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="mb-3 position-relative">
        <label htmlFor="nuevaPassword">Nueva contraseña</label>
        <div className="input-icon-wrapper">
          <input
            id="nuevaPassword"
            name="nuevaPassword"
            type={verNueva ? "text" : "password"}
            className="input-field"
            required
            minLength={6}
            value={nuevaPassword}
            onChange={handleChange}
          />
          <span
            onClick={() => setVerNueva(!verNueva)}
            aria-label="Mostrar u ocultar nueva contraseña"
          >
            {verNueva ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <button type="submit" className="btn btn-dark w-100">
        Cambiar contraseña
      </button>
    </form>
  );
};

export default FormularioCambiarContraseña;
