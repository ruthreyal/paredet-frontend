import React, { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; // minúscula como acordamos
import { FaUserPlus, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const token = await authService.login(email, password);
      localStorage.setItem("token", token);
      navigate("/"); 
    } catch (error) {
      setMensaje("Credenciales incorrectas"); 
    }
  };
  

  return (
    <main className="container login-container" role="main" aria-label="Página de identificación">
      {/* Caja Crear cuenta */}
      <section className="login-box" aria-labelledby="crear-cuenta">
  <h2 id="crear-cuenta" className="section-title">Crear cuenta</h2>
  <p>
    Crea una nueva cuenta gratuita y disfruta de todas las ventajas de Mi Cuenta Paredet.
  </p>
  <div className="login-message-container mt-3"></div>
  <button
    className="btn btn-outline-dark w-100 mt-2"
    aria-label="Crear cuenta"
    onClick={() => navigate("/registro")}
  >
    <FaUserPlus className="me-2" />
    Crear cuenta
  </button>
  
</section>


      {/* Caja Tengo cuenta */}
      <section className="login-box" aria-labelledby="tengo-cuenta">
  <h2 id="tengo-cuenta" className="section-title">Tengo cuenta</h2>
  <form onSubmit={handleLogin}>
    <div className="mb-3">
      <label htmlFor="email" className="form-label">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        className="input-field"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    <div className="mb-3">
      <label htmlFor="password" className="form-label">Contraseña</label>
      <input
        id="password"
        name="password"
        type="password"
        className="input-field"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    {/* 🔥 Mensaje de error arriba del botón */}
    {mensaje && (
      <div className="alert alert-danger mt-2 login-message-container" role="alert">
        {mensaje}
      </div>
    )}

    <p className="forgot-password">¿Olvidaste tu contraseña?</p>

    <button type="submit" className="btn btn-outline-dark w-100 mt-2" aria-label="Entrar">
      <FaLock className="me-2" />
      Entrar
    </button>
  </form>
</section>
    </main>
  );
};

export default Login;






  