import React from "react";
import Select from "react-select";

const UsuarioForm = ({
  formData,
  handleChange,
  readonlyEmail,
  paisesConCiudades,
  isAdmin,
  children,
}) => {
  const paises = Object.keys(paisesConCiudades).map((pais) => ({
    label: pais,
    value: pais,
  }));

  const ciudades =
    formData.pais && paisesConCiudades[formData.pais]
      ? paisesConCiudades[formData.pais].map((ciudad) => ({
          label: ciudad,
          value: ciudad,
        }))
      : [];

  return (
    <>
      <div className="mb-3">
        <label htmlFor="nombre">Nombre <span aria-hidden="true">*</span></label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          className="input-field"
          required
          value={formData.nombre}
          onChange={handleChange}
          aria-required="true"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="apellido">Apellido <span aria-hidden="true">*</span></label>
        <input
          id="apellido"
          name="apellido"
          type="text"
          className="input-field"
          required
          aria-required="true"
          value={formData.apellido}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
        <input
          id="email"
          name="email"
          type="email"
          className="input-field"
          required
          aria-required="true"
          value={formData.email}
          onChange={handleChange}
          readOnly={readonlyEmail}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="telefono">Teléfono <span aria-hidden="true">*</span></label>
        <input
          id="telefono"
          name="telefono"
          type="text"
          className="input-field"
          required
          aria-required="true"
          value={formData.telefono}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="direccion">Dirección </label>
        <input
          id="direccion"
          name="direccion"
          type="text"
          className="input-field"
          value={formData.direccion}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="pais">País </label>
        <Select
          id="pais"
          name="pais"
          options={paises}
          value={paises.find((p) => p.value === formData.pais)}
          onChange={(selected) =>
            handleChange({ target: { name: "pais", value: selected.value } })
          }
          placeholder="Selecciona un país"
          isSearchable
        />
      </div>

      <div className="mb-3">
        <label htmlFor="ciudad">Ciudad </label>
        <Select
          id="ciudad"
          name="ciudad"
          options={ciudades}
          value={ciudades.find((c) => c.value === formData.ciudad)}
          onChange={(selected) =>
            handleChange({ target: { name: "ciudad", value: selected.value } })
          }
          placeholder="Selecciona una ciudad"
          isSearchable
          isDisabled={!formData.pais}
        />
      </div>
      {isAdmin && (
        <div className="mb-3">
          <label htmlFor="rol">Rol <span aria-hidden="true">*</span></label>
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
