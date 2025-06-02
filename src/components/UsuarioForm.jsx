import React from "react";
import Select from "react-select";
import { FaExclamationCircle } from "react-icons/fa";
import citiesData from "../data/cities.json";

const UsuarioForm = ({
  formData,
  handleChange,
  readonlyEmail,
  isAdmin,
  children,
  errors,
}) => {
  const paises = Object.keys(citiesData).map((pais) => ({
    label: pais,
    value: pais,
  }));

  const ciudades =
    formData.pais && citiesData[formData.pais]
      ? citiesData[formData.pais].map((ciudad) => ({
          label: ciudad,
          value: ciudad,
        }))
      : [];

  return (
    <>
      <div className="mb-3">
        <label htmlFor="nombre">
          Nombre <span aria-hidden="true">*</span>
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          className={`input-field ${errors?.nombre ? "is-invalid" : ""}`}
          required
          value={formData.nombre}
          onChange={handleChange}
          aria-required="true"
          aria-describedby={errors?.nombre ? "error-nombre" : undefined}
        />
        {errors?.nombre && (
          <div
            className="form-error invalid-feedback"
            id="error-nombre"
            role="alert"
          >
            <FaExclamationCircle className="icono-error" />
            {errors.nombre}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="apellido">
          Apellido <span aria-hidden="true">*</span>
        </label>
        <input
          id="apellido"
          name="apellido"
          type="text"
          className={`input-field ${errors?.apellido ? "is-invalid" : ""}`}
          required
          aria-required="true"
          aria-describedby={errors?.apellido ? "error-apellido" : undefined}
          value={formData.apellido}
          onChange={handleChange}
        />
        {errors?.apellido && (
          <div
            className="form-error invalid-feedback"
            id="error-apellido"
            role="alert"
          >
            <FaExclamationCircle className="icono-error" />
            {errors.apellido}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="email">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="text"
          inputMode="email"
          autoComplete="email"
          className={`input-field ${errors?.email ? "is-invalid" : ""}`}
          required
          aria-required="true"
          aria-describedby={errors?.email ? "error-email" : undefined}
          value={formData.email}
          onChange={handleChange}
          readOnly={readonlyEmail}
        />
        {errors?.email && (
          <div
            className="form-error invalid-feedback"
            id="error-email"
            role="alert"
          >
            <FaExclamationCircle className="icono-error" />
            {errors.email}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="telefono">
          Teléfono <span aria-hidden="true">*</span>
        </label>
        <input
          id="telefono"
          name="telefono"
          type="text"
          className={`input-field ${errors?.telefono ? "is-invalid" : ""}`}
          required
          aria-required="true"
          aria-describedby={errors?.telefono ? "error-telefono" : undefined}
          value={formData.telefono}
          onChange={handleChange}
        />
        {errors?.telefono && (
          <div
            className="form-error invalid-feedback"
            id="error-telefono"
            role="alert"
          >
            <FaExclamationCircle className="icono-error" />
            {errors.telefono}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="direccion">Dirección</label>
        <input
          id="direccion"
          name="direccion"
          type="text"
          className={`input-field ${errors?.direccion ? "is-invalid" : ""}`}
          aria-describedby={errors?.direccion ? "error-direccion" : undefined}
          value={formData.direccion}
          onChange={handleChange}
        />
        {errors?.direccion && (
          <div
            className="form-error invalid-feedback"
            id="error-direccion"
            role="alert"
          >
            <FaExclamationCircle className="icono-error" />
            {errors.direccion}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="pais">País</label>
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
          aria-label="País"
          classNamePrefix="react-select"
          className={errors?.pais ? "react-select-error" : ""}
          aria-describedby={errors?.pais ? "error-pais" : undefined}
        />
        {errors?.pais && (
          <div
            className="form-error invalid-feedback"
            id="error-pais"
            role="alert"
          >
            <FaExclamationCircle className="icono-error" />
            {errors.pais}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="ciudad">Ciudad</label>
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
          aria-label="Ciudad"
          classNamePrefix="react-select"
          className={errors?.ciudad ? "react-select-error" : ""}
          aria-describedby={errors?.ciudad ? "error-ciudad" : undefined}
        />
        {errors?.ciudad && (
          <div
            className="form-error invalid-feedback"
            id="error-ciudad"
            role="alert"
          >
            <FaExclamationCircle className="icono-error" />
            {errors.ciudad}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="codigoPostal">Código postal</label>
        <input
          id="codigoPostal"
          name="codigoPostal"
          type="text"
          className={`input-field ${errors?.codigoPostal ? "is-invalid" : ""}`}
          aria-describedby={
            errors?.codigoPostal ? "error-codigoPostal" : undefined
          }
          value={formData.codigoPostal}
          onChange={handleChange}
        />
        {errors?.codigoPostal && (
          <div
            className="form-error invalid-feedback"
            id="error-codigoPostal"
            role="alert"
          >
            <FaExclamationCircle className="icono-error" />
            {errors.codigoPostal}
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="mb-3">
          <label htmlFor="rol">
            Rol <span aria-hidden="true">*</span>
          </label>
          <select
            id="rol"
            name="rol"
            className={`input-field ${errors?.rol ? "is-invalid" : ""}`}
            value={formData.rol}
            onChange={handleChange}
            required
            aria-required="true"
            aria-describedby={errors?.rol ? "error-rol" : undefined}
          >
            <option value="USER">Usuario</option>
            <option value="ADMIN">Administrador</option>
          </select>
          {errors?.rol && (
            <div
              className="form-error invalid-feedback"
              id="error-rol"
              role="alert"
            >
              <FaExclamationCircle className="icono-error" />
              {errors.rol}
            </div>
          )}
        </div>
      )}

      {children}
    </>
  );
};

export default UsuarioForm;
