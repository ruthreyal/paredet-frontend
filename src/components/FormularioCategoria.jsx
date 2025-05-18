import React, { useState } from "react";
import categoriaService from "../services/categoriaService";

const FormularioCategoria = ({ onCategoriaCreada }) => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const nuevaCategoria = { nombre };
      await categoriaService.createCategoria(nuevaCategoria, token);
      setMensaje("Categoría creada correctamente");
      setNombre("");
      if (onCategoriaCreada) onCategoriaCreada(); // para recargar lista
    } catch (err) {
      console.error("Error al crear categoría:", err);
      setError("No se pudo crear la categoría");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-admin">
      <h2>Crear nueva categoría</h2>
      <div className="form-group">
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Papel pintado vinílico"
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      {mensaje && <p className="success-text">{mensaje}</p>}
      <button type="submit" className="btn-dorado">
        Crear categoría
      </button>
    </form>
  );
};

export default FormularioCategoria;