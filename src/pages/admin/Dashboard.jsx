import React, { useEffect, useState } from "react";
import usuarioService from "../../services/usuarioService";
import "../../styles/dashboard.css";


const Dashboard = () => {
    const [totalUsuarios, setTotalUsuarios] = useState(0);

    useEffect(() => {
      const token = localStorage.getItem("token");
      const cargarUsuarios = async () => {
        try {
          const usuarios = await usuarioService.getTodosUsuarios(token);
          setTotalUsuarios(usuarios.length);
        } catch (error) {
          console.error("Error al cargar usuarios:", error);
        }
      };
  
      cargarUsuarios();
    }, []);

  return (
    <div className="dashboard-container">
      <h2 className="section-title">Resumen general</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Usuarios registrados</h3>
          <p className="dashboard-value">{totalUsuarios}</p>
        </div>
        <div className="dashboard-card">
          <h3>Productos publicados</h3>
          <p className="dashboard-value">0</p>
        </div>
        <div className="dashboard-card">
          <h3>Pedidos realizados</h3>
          <p className="dashboard-value">0</p>
        </div>
        <div className="dashboard-card">
          <h3>Colecciones</h3>
          <p className="dashboard-value">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
