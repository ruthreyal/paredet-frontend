import React, { useState, useContext } from "react";
import authService from "../services/authService";
import usuarioService from "../services/usuarioService";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { FaUserPlus, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const token = await authService.login(emailInput, password);
      login(token);

      // Extraer email del token (sin sobrescribir el email del input)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const emailFromToken = payload.sub;

      // Obtener datos del usuario desde el backend
      const usuario = await usuarioService.getUsuarioPorEmail(emailFromToken, token);

      // Redirigir según el rol
      if (usuario.rolNombre === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMensaje("Credenciales incorrectas");
    }
  };

  return (
    <main className="container login-container" role="main" aria-label="Página de identificación">
      <section className="login-box" aria-labelledby="crear-cuenta">
        <h2 id="crear-cuenta" className="section-title">Crear cuenta</h2>
        <p>Crea una nueva cuenta gratuita y disfruta de todas las ventajas de Mi Cuenta Paredet.</p>
        <button className="btn btn-outline-dark w-100 mt-2" onClick={() => navigate("/registro")}>
          <FaUserPlus className="me-2" /> Crear cuenta
        </button>
      </section>

      <section className="login-box" aria-labelledby="tengo-cuenta">
        <h2 id="tengo-cuenta" className="section-title">Tengo cuenta</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              id="password"
              type={verPassword ? "text" : "password"}
              className="input-field"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setVerPassword(!verPassword)}
              className="position-absolute top-50 end-0 translate-middle-y pe-3"
              style={{ cursor: "pointer" }}
            >
              {verPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {mensaje && (
            <div className="alert alert-danger mt-2" role="alert">
              {mensaje}
            </div>
          )}

          <p className="forgot-password">
            <button
              type="button"
              className="btn btn-link p-0"
              role="link"
              onClick={() => navigate("/recuperar-password")}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>


          <button type="submit" className="btn btn-outline-dark w-100 mt-2">
            <FaLock className="me-2" /> Entrar
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;







  