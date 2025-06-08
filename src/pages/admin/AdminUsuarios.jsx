import React, { useState, useCallback } from "react";
import usuarioService from "../../services/usuarioService";
import "../../styles/adminUsuarios.css";
import FormularioCrearUsuario from "./FormularioCrearUsuario";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  const token = localStorage.getItem("token");

  const cargarUsuarios = useCallback(async () => {
  try {
    const data = await usuarioService.getTodosUsuarios(token);
    setUsuarios(data);
  } catch (error) {
    setMensaje("Error al cargar usuarios");
  } finally {
    setLoading(false);
  }
}, [token]);

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setUsuarioEditar(null);
  };

  return (
    <div className="admin-usuarios-container">
      <h1 className="section-title text-center mb-5">Gestión de Usuarios</h1>

      {mostrarFormulario || usuarioEditar ? (
        <FormularioCrearUsuario
          token={token}
          usuarioInicial={usuarioEditar}
          onCancelar={cerrarFormulario}
          onUsuarioGuardado={async () => {
            await cargarUsuarios();
            cerrarFormulario();
            setMensaje("Usuario guardado correctamente");
            setTimeout(() => setMensaje(""), 3000);
          }}
        />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-5" style={{ gap: "1rem" }}>
            <input
              type="text"
              placeholder="Buscar por nombre o email"
              className="input-field mb-0"
              style={{ flex: "1", maxWidth: "400px" }}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar usuario"
            />
            <button
              className="btn btn-outline-dark w-40 mt-0"
              onClick={() => setMostrarFormulario(true)}
              aria-label="Crear nuevo usuario"
            >
              + Crear usuario
            </button>
          </div>

          {loading ? (
            <p>Cargando usuarios...</p>
          ) : usuariosFiltrados.length === 0 ? (
            <p>No hay usuarios registrados</p>
          ) : (
            <table className="tabla-usuarios">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th className="d-none d-md-table-cell">Apellido</th>
                  <th>Email</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr
                    key={usuario.id}
                    onClick={() => setUsuarioEditar(usuario)}
                    style={{ cursor: "pointer" }}
                    aria-label={`Editar usuario ${usuario.nombre}`}
                  >
                    <td>{usuario.nombre}</td>
                    <td className="d-none d-md-table-cell">{usuario.apellido}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.rolNombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {mensaje && (
        <div className="alerta-exito mt-4" role="status" aria-live="polite">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;

