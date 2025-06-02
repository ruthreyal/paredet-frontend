import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/apiConfig";
import "../styles/EntidadSimpleAdmin.css";
import "../styles/utils.css";
import SubidaImagen from "../components/SubidaImagen";

const EntidadSimpleAdmin = ({ titulo, endpoint, nombreEntidadSingular }) => {
  const [items, setItems] = useState([]);
  const [modoCrear, setModoCrear] = useState(false);
  const [modoEditarId, setModoEditarId] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [editNombre, setEditNombre] = useState("");
  const [nuevaImagenUrl, setNuevaImagenUrl] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editImagenUrl, setEditImagenUrl] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
      setItems(response.data);
    } catch {
      setError(`Error al cargar ${titulo.toLowerCase()}`);
    }
  };

  const handleGuardarNuevo = async () => {
    if (!nuevoNombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/${endpoint}`,
        {
          nombre: nuevoNombre,
          descripcion: nuevaDescripcion,
          imagenUrl: nuevaImagenUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNuevoNombre("");
      setNuevaDescripcion("");
      setNuevaImagenUrl("");
      setModoCrear(false);
      setMensaje(`${nombreEntidadSingular} creada correctamente`);
      cargarDatos();
    } catch {
      setError(`No se pudo crear la ${nombreEntidadSingular}`);
    }
  };

  const handleEditar = (id, nombre, descripcion, imagenUrl) => {
    setModoEditarId(id);
    setEditNombre(nombre);
    setEditDescripcion(descripcion || "");
    setEditImagenUrl(imagenUrl || "");
    setMensaje("");
    setError("");
  };

  const handleGuardarEdicion = async (id) => {
    if (!editNombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/${endpoint}/${id}`,
        {
          nombre: editNombre,
          descripcion: editDescripcion,
          imagenUrl: editImagenUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setModoEditarId(null);
      setEditDescripcion("");
      setEditImagenUrl("");
      setMensaje(`${nombreEntidadSingular} actualizada correctamente`);
      cargarDatos();
    } catch {
      setError(`No se pudo actualizar la ${nombreEntidadSingular}`);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esto?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("categoría eliminada");
      setTimeout(() => setMensaje(""), 3000);
      cargarDatos();
    } catch {
      setError("No se pudo eliminar la categoría");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="admin-usuarios-container">
      <h2 className="section-title">Gestión de {titulo}</h2>

      <div className="mb-3">
        <button
          className="btn btn-outline-dark w-40"
          onClick={() => {
            setModoCrear(true);
            setMensaje("");
            setError("");
          }}
          aria-label={`Crear nueva ${nombreEntidadSingular}`}
        >
          + Crear {nombreEntidadSingular}
        </button>
      </div>

      {mensaje && (
        <p className="success-text">
          {mensaje}
          {setTimeout(() => setMensaje(""), 3000)}
        </p>
      )}
      {error && (
        <p className="error-text">
          {error}
          {setTimeout(() => setError(""), 3000)}
        </p>
      )}

      {/* FORMULARIO DE CREACIÓN FUERA DE LA TABLA */}
      {modoCrear && (
        <div className="formulario-creacion mb-4">
          <h5>Nueva {nombreEntidadSingular}</h5>

          <input
            type="text"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            className="form-control mb-2"
            placeholder={`Nombre de la nueva ${nombreEntidadSingular}`}
            aria-label="Nombre"
          />

          <textarea
            value={nuevaDescripcion}
            onChange={(e) => setNuevaDescripcion(e.target.value)}
            className="form-control mb-2"
            placeholder="Descripción (opcional)"
            rows={3}
            aria-label="Descripción"
          />

          <SubidaImagen
            onUploadSuccess={(url) => setNuevaImagenUrl(url)}
            carpeta="colecciones"
          />

          <button className="btn btn-outline-dark w-40" onClick={handleGuardarNuevo}>
            Guardar {nombreEntidadSingular}
          </button>
        </div>
      )}

      {/* TABLA DE ELEMENTOS */}
      <table className="tabla-entidad-admin">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="3">No hay {titulo.toLowerCase()} registradas.</td>
            </tr>
          ) : (
            items.map((item) =>
              modoEditarId === item.id ? (
                <tr key={item.id}>
                  <td colSpan="3">
                    <div className="formulario-creacion mb-4">
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        className="form-control mb-2"
                        placeholder="Nuevo nombre"
                      />

                      <textarea
                        value={editDescripcion}
                        onChange={(e) => setEditDescripcion(e.target.value)}
                        className="form-control mb-2"
                        placeholder="Nueva descripción (opcional)"
                        rows={3}
                        aria-label="Descripción"
                      />

                      <SubidaImagen
                        onUploadSuccess={(url) => setEditImagenUrl(url)}
                        carpeta="colecciones"
                      />

                      <div className="mt-2">
                        <button
                          className="btn btn-outline-dark w-40"
                          onClick={() => handleGuardarEdicion(item.id)}
                        >
                          Guardar
                        </button>
                        <button
                          className="btn btn-dark w-40"
                          onClick={() => setModoEditarId(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nombre}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-outline-dark w-40"
                      onClick={() =>
                        handleEditar(
                          item.id,
                          item.nombre,
                          item.descripcion,
                          item.imagenUrl
                        )
                      }
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-dark w-40"
                      onClick={() => handleEliminar(item.id)}
                      aria-label={`Eliminar ${nombreEntidadSingular}`}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EntidadSimpleAdmin;
