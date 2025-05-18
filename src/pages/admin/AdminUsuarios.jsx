import React, { useEffect, useState } from "react";
import usuarioService from "../../services/usuarioService";
import "../../styles/adminUsuarios.css";
import { useNavigate } from "react-router-dom";
import FormularioCrearUsuario from "./FormularioCrearUsuario";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await usuarioService.getTodosUsuarios(token);
        setUsuarios(data);
      } catch (error) {
        setMensaje("Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, [token]);

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="admin-usuarios-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="section-title">Gestión de Usuarios</h2>
        <button
          className="btn-acceso"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          aria-label="Crear nuevo usuario"
        >
          {mostrarFormulario ? "Cancelar" : "+ Crear usuario"}
        </button>
      </div>

      {mostrarFormulario && (
        <FormularioCrearUsuario
          token={token}
          onUsuarioCreado={async () => {
            const data = await usuarioService.getTodosUsuarios(token);
            setUsuarios(data);
            setMostrarFormulario(false);
          }}
        />
      )}

      <input
        type="text"
        placeholder="Buscar por nombre o email"
        className="input-field mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        aria-label="Buscar usuario"
      />

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : usuariosFiltrados.length === 0 ? (
        <p>No hay usuarios registrados</p>
      ) : (
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col" className="d-none d-md-table-cell">Apellido</th>
              <th scope="col">Email</th>
              <th scope="col">Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario) => (
              <tr
                key={usuario.id}
                onClick={() => navigate(`/admin/usuarios/editar/${usuario.email}`)}
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

      {mensaje && <p className="mt-3">{mensaje}</p>}
    </div>
  );
};

export default AdminUsuarios;


