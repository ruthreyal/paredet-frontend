import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UsuarioForm = ({
  formData,
  handleChange,
  mostrarPassword,
  verPassword,
  setVerPassword,
  verRepetir,
  setVerRepetir,
  readonlyEmail,
  paisesConCiudades,
  children
}) => (
  <>
    <div className="mb-3">
      <label htmlFor="nombre">Nombre *</label>
      <input id="nombre" name="nombre" type="text" className="input-field" required value={formData.nombre} onChange={handleChange} />
    </div>

    <div className="mb-3">
      <label htmlFor="apellido">Apellido *</label>
      <input id="apellido" name="apellido" type="text" className="input-field" required value={formData.apellido} onChange={handleChange} />
    </div>

    <div className="mb-3">
      <label htmlFor="email">Email *</label>
      <input id="email" name="email" type="email" className="input-field" required value={formData.email} onChange={handleChange} readOnly={readonlyEmail} />
    </div>

    {mostrarPassword && (
      <>
        <div className="mb-3 position-relative">
          <label htmlFor="password">Contraseña *</label>
          <input
            id="password"
            name="password"
            type={verPassword ? "text" : "password"}
            className="input-field"
            required
            minLength="6"
            value={formData.password}
            onChange={handleChange}
          />
          <span onClick={() => setVerPassword(!verPassword)} className="position-absolute top-50 end-0 translate-middle-y pe-3" style={{ cursor: "pointer" }}>
            {verPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="mb-3 position-relative">
          <label htmlFor="repetirPassword">Repetir contraseña *</label>
          <input
            id="repetirPassword"
            name="repetirPassword"
            type={verRepetir ? "text" : "password"}
            className="input-field"
            required
            minLength="6"
            value={formData.repetirPassword}
            onChange={handleChange}
          />
          <span onClick={() => setVerRepetir(!verRepetir)} className="position-absolute top-50 end-0 translate-middle-y pe-3" style={{ cursor: "pointer" }}>
            {verRepetir ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </>
    )}

    <div className="mb-3">
      <label htmlFor="telefono">Teléfono *</label>
      <input id="telefono" name="telefono" type="tel" className="input-field" required value={formData.telefono} onChange={handleChange} />
    </div>

    <div className="mb-3">
      <label htmlFor="direccion">Dirección</label>
      <input id="direccion" name="direccion" type="text" className="input-field" value={formData.direccion} onChange={handleChange} />
    </div>

    <div className="mb-3">
      <label htmlFor="pais">País</label>
      <select id="pais" name="pais" className="input-field" value={formData.pais} onChange={handleChange}>
        <option value="">Selecciona un país</option>
        {Object.keys(paisesConCiudades).map((pais) => (
          <option key={pais} value={pais}>{pais}</option>
        ))}
      </select>
    </div>

    {formData.pais && (
      <div className="mb-3">
        <label htmlFor="ciudad">Ciudad</label>
        <select id="ciudad" name="ciudad" className="input-field" value={formData.ciudad} onChange={handleChange}>
          <option value="">Selecciona una ciudad</option>
          {paisesConCiudades[formData.pais].map((ciudad) => (
            <option key={ciudad} value={ciudad}>{ciudad}</option>
          ))}
        </select>
      </div>
    )}

    <div className="mb-3">
      <label htmlFor="codigoPostal">Código Postal</label>
      <input id="codigoPostal" name="codigoPostal" type="text" className="input-field" value={formData.codigoPostal} onChange={handleChange} />
    </div>

    {children}
  </>
);

export default UsuarioForm;



