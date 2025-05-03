// src/pages/admin/AdminUsuarios.jsx
import React, { useEffect, useState, useContext } from "react";
import usuarioService from "../../services/usuarioService";
import { AuthContext } from "../../context/AuthContext";

const AdminUsuarios = () => {
  const { token } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await usuarioService.getTodosLosUsuarios(token);
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    fetchUsuarios();
  }, [token]);

  return (
    <div className="container-fluid">
      <h2 className="titulo-seccion mb-4">Gestión de usuarios</h2>
      <div className="table-responsive">
        <table className="table table-bordered align-middle shadow-sm bg-white">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre} {usuario.apellido}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2">Editar</button>
                  <button className="btn btn-sm btn-outline-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsuarios;

