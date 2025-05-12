import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const FormularioContraseñaNueva = ({
  password,
  repetirPassword,
  verPassword,
  setVerPassword,
  verRepetir,
  setVerRepetir,
  handleChange
}) => {
  return (
    <>
      <div className="mb-3 position-relative">
        <label htmlFor="password">Contraseña *</label>
        <div className="input-icon-wrapper">
          <input
            id="password"
            name="password"
            type={verPassword ? "text" : "password"}
            className="input-field"
            required
            value={password}
            onChange={handleChange}
          />
          <span
            onClick={() => setVerPassword(!verPassword)}
            aria-label="Mostrar u ocultar contraseña"
          >
            {verPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="mb-3 position-relative">
        <label htmlFor="repetirPassword">Repetir contraseña *</label>
        <div className="input-icon-wrapper">
          <input
            id="repetirPassword"
            name="repetirPassword"
            type={verRepetir ? "text" : "password"}
            className="input-field"
            required
            value={repetirPassword}
            onChange={handleChange}
          />
          <span
            onClick={() => setVerRepetir(!verRepetir)}
            aria-label="Mostrar u ocultar contraseña"
          >
            {verRepetir ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>
    </>
  );
};

export default FormularioContraseñaNueva;
