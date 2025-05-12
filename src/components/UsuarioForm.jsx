import React from "react";

const UsuarioForm = ({
  formData,
  handleChange,
  readonlyEmail,
  paisesConCiudades,
  isAdmin,
  children
}) => {
  if (!formData) return null;

  return (
    <>
      <div className="mb-3">
        <label htmlFor="nombre">Nombre *</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          className="input-field"
          required
          value={formData.nombre}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="apellido">Apellido *</label>
        <input
          id="apellido"
          name="apellido"
          type="text"
          className="input-field"
          required
          value={formData.apellido}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          className="input-field"
          required
          value={formData.email}
          onChange={handleChange}
          readOnly={readonlyEmail}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="telefono">Teléfono *</label>
        <input
          id="telefono"
          name="telefono"
          type="text"
          className="input-field"
          required
          value={formData.telefono}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="direccion">Dirección *</label>
        <input
          id="direccion"
          name="direccion"
          type="text"
          className="input-field"
          required
          value={formData.direccion}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="ciudad">Ciudad *</label>
        <input
          id="ciudad"
          name="ciudad"
          type="text"
          className="input-field"
          required
          value={formData.ciudad}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="codigoPostal">Código postal *</label>
        <input
          id="codigoPostal"
          name="codigoPostal"
          type="text"
          className="input-field"
          required
          value={formData.codigoPostal}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="pais">País *</label>
        <input
          id="pais"
          name="pais"
          type="text"
          className="input-field"
          required
          value={formData.pais}
          onChange={handleChange}
        />
      </div>

      {isAdmin && (
        <div className="mb-3">
          <label htmlFor="rol">Rol *</label>
          <select
            id="rol"
            name="rol"
            className="input-field"
            value={formData.rol}
            onChange={handleChange}
            required
          >
            <option value="USER">Usuario</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
      )}

      {children}
    </>
  );
};

export default UsuarioForm;




