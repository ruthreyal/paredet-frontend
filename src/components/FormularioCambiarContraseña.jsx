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
      <h5 className="mb-3">Cambiar contraseña <span aria-hidden="true">*</span></h5>

      <div className="mb-3 position-relative">
        <label htmlFor="contrasenaActual">Contraseña actual <span aria-hidden="true">*</span></label>
        <div className="input-icon-wrapper">
          <input
            id="contrasenaActual"
            name="contrasenaActual"
            type={verActual ? "text" : "password"}
            className="input-field"
            required
            aria-required="true"
            value={contrasenaActual}
            onChange={handleChange}
          />
          <span
            onClick={() => setVerActual(!verActual)}
            aria-label="Mostrar u ocultar contraseña actual"
          >
            {verActual ? <FaEye /> : <FaEyeSlash /> }
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
            aria-required="true"
            minLength={6}
            value={nuevaPassword}
            onChange={handleChange}
          />
          <span
            onClick={() => setVerNueva(!verNueva)}
            aria-label="Mostrar u ocultar nueva contraseña"
          >
            {verNueva ? <FaEye /> : <FaEyeSlash /> }
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
