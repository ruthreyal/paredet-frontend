import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaExclamationCircle } from "react-icons/fa";


const FormularioContraseñaNueva = ({
  password,
  repetirPassword,
  verPassword,
  setVerPassword,
  verRepetir,
  setVerRepetir,
  handleChange,
  errors
}) => {
  return (
    <>
      <div className="mb-3 position-relative">
        <label htmlFor="password">
          Contraseña <span aria-hidden="true">*</span>
        </label>
        <div className="input-icon-wrapper">
          <input
            id="password"
            name="password"
            type={verPassword ? "text" : "password"}
            className="input-field"
            required
            aria-required="true"
            value={password}
            onChange={handleChange}
          />
          <span
            onClick={() => setVerPassword(!verPassword)}
            aria-label="Mostrar u ocultar contraseña"
          >
            {verPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        {errors?.password && (
          <div className="form-error" role="alert"><FaExclamationCircle className="icono-error" />{errors.password}</div>
        )}
      </div>

      <div className="mb-3 position-relative">
        <label htmlFor="repetirPassword">
          Repetir contraseña <span aria-hidden="true">*</span>
        </label>
        <div className="input-icon-wrapper">
          <input
            id="repetirPassword"
            name="repetirPassword"
            type={verRepetir ? "text" : "password"}
            className="input-field"
            required
            aria-required="true"
            value={repetirPassword}
            onChange={handleChange}
          />
          <span
            onClick={() => setVerRepetir(!verRepetir)}
            aria-label="Mostrar u ocultar contraseña"
          >
            {verRepetir ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        {errors?.repetirPassword && (
          <div className="form-error" role="alert"><FaExclamationCircle className="icono-error" />{errors.repetirPassword}</div>
        )}
      </div>
    </>
  );
};

export default FormularioContraseñaNueva;

