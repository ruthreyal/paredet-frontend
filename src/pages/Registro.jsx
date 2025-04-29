import React, { useState } from "react";
import "../styles/login.css"; 
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import registroService from "../services/registroService"; 

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    pais: "",
    ciudad: "",
    codigoPostal: ""
  });

  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await registroService.register(formData);
      localStorage.setItem("token", token);
      navigate("/login"); 
    } catch (error) {
      setMensaje("Error al registrar. Verifica los datos.");
    }
  };
  

  return (
    <main className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", paddingTop: "3rem", paddingBottom: "3rem" }}>
      <section className="login-box d-flex flex-column justify-content-between" style={{ maxWidth: "500px", width: "100%" }} aria-labelledby="registro">
        
        <h2 id="registro" className="section-title">Formulario de registro</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Campos de formulario */}
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
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password">Contraseña *</label>
            <input
              id="password"
              name="password"
              type="password"
              className="input-field"
              required
              minLength="5"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="telefono">Teléfono *</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              className="input-field"
              required
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="pais">País</label>
            <input
              id="pais"
              name="pais"
              type="text"
              className="input-field"
              value={formData.pais}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="ciudad">Ciudad</label>
            <input
              id="ciudad"
              name="ciudad"
              type="text"
              className="input-field"
              value={formData.ciudad}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="codigoPostal">Código Postal</label>
            <input
              id="codigoPostal"
              name="codigoPostal"
              type="text"
              className="input-field"
              value={formData.codigoPostal}
              onChange={handleChange}
            />
            
          </div>
          <div className="login-message-container mt-3" role="alert">
          {mensaje && (
            <div className={`alert ${mensaje.includes("exitoso") ? "alert-success" : "alert-danger"}`}>
              {mensaje}
            </div>
          )}
        </div>
          <button type="submit" className="btn-gold w-100 mt-3">
            <FaUserPlus className="me-2" />
            Registrarse
          </button>

        </form>
        
      </section>
    </main>
  );
};

export default Registro;



