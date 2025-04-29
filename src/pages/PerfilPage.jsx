import React, { useEffect, useState } from "react";
import usuarioService from "../services/usuarioService";
import { FaSave, FaPlus } from "react-icons/fa";
import "../styles/login.css";
import axios from "axios";

const PerfilPage = () => {
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const token = localStorage.getItem("token");
  const email = token ? JSON.parse(atob(token.split(".")[1])).sub : null;

  useEffect(() => {
    const fetchUsuario = async () => {
      if (!email || !token) return;
      try {
        const datos = await usuarioService.getUsuarioPorEmail(email, token);
        setUsuario(datos);
      } catch (error) {
        setMensaje("Error al cargar los datos del usuario");
      }
    };
    fetchUsuario();
  }, [email, token]);

  const handleChange = (e) => {
    setUsuario((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://backend-production-cfd6.up.railway.app/api/usuarios/${usuario.id}`,
        usuario,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensaje("Datos actualizados correctamente");
    } catch (error) {
      setMensaje("Error al actualizar los datos");
    }
  };

  if (!usuario) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <main className="container login-container py-5">
      <section className="login-box" style={{ maxWidth: "500px", width: "100%" }}>
        <h2>Mi perfil</h2>
        <form onSubmit={handleGuardar}>
          <div className="mb-3">
            <label>Nombre *</label>
            <input type="text" name="nombre" value={usuario.nombre || ""} onChange={handleChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label>Apellido *</label>
            <input type="text" name="apellido" value={usuario.apellido || ""} onChange={handleChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label>Email *</label>
            <input type="email" name="email" value={usuario.email || ""} className="form-control" readOnly />
          </div>

          <div className="mb-3">
            <label>Teléfono *</label>
            <input type="tel" name="telefono" value={usuario.telefono || ""} onChange={handleChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label>País</label>
            <input type="text" name="pais" value={usuario.pais || ""} onChange={handleChange} className="form-control" />
          </div>

          <div className="mb-3">
            <label>Ciudad</label>
            <input type="text" name="ciudad" value={usuario.ciudad || ""} onChange={handleChange} className="form-control" />
          </div>

          <div className="mb-3">
            <label>Código Postal</label>
            <input type="text" name="codigoPostal" value={usuario.codigoPostal || ""} onChange={handleChange} className="form-control" />
          </div>

          <button type="submit" className="btn btn-gold w-100">
            <FaSave className="me-2" /> Guardar cambios
          </button>
        </form>

        <button className="btn btn-outline-secondary w-100 mt-3">
          <FaPlus className="me-2" /> Añadir dirección
        </button>

        {mensaje && (
          <div
            className={`alert mt-3 ${mensaje.includes("correctamente") ? "alert-success" : "alert-danger"}`}
            role="alert"
          >
            {mensaje}
          </div>
        )}
      </section>
    </main>
  );
};

export default PerfilPage;

