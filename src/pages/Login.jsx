import React, { useState, useContext } from "react";
import authService from "../services/authService";
import usuarioService from "../services/usuarioService";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import registroService from "../services/registroService";

import {
  FaUserPlus,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [verPassword, setVerPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = "Introduce un email válido.";
    }

    if (!formData.password.trim()) {
      nuevosErrores.password = "La contraseña no puede estar vacía.";
    }

    return nuevosErrores;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    try {
      // Usamos el servicio de registro para comprobar si el email existe
      const existe = await registroService.emailExiste(formData.email);
      if (!existe) {
        setErrors({ email: "No existe ninguna cuenta con este email." });
        return;
      }

      const token = await authService.login(formData.email, formData.password);
      login(token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const usuario = await usuarioService.getUsuarioPorEmail(
        payload.sub,
        token
      );

      if (usuario.rolNombre === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrors({ password: "La contraseña es incorrecta." });
    }
  };

  return (
    <main
      className="container login-container"
      role="main"
      aria-label="Página de identificación"
    >
      <section
        className="login-box login-box-registro d-none d-md-flex"
        aria-labelledby="crear-cuenta"
      >
        <h2 id="crear-cuenta" className="section-title">
          Crear cuenta
        </h2>
        <p>
          Crea una nueva cuenta gratuita y disfruta de todas las ventajas de Mi
          Cuenta Paredet.
        </p>
        <button
          className="btn btn-outline-dark w-100 mt-2"
          onClick={() => navigate("/registro")}
        >
          <FaUserPlus className="me-2" /> Crear cuenta
        </button>
      </section>

      <section className="login-box" aria-labelledby="tengo-cuenta">
        <h2 id="tengo-cuenta" className="section-title">
          Tengo cuenta
        </h2>
        <form onSubmit={handleLogin} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email <span aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="text"
              inputMode="email"
              autoComplete="email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              aria-required="true"
            />
            {errors.email && (
              <div className="form-error" role="alert">
                <FaExclamationCircle className="icono-error" /> {errors.email}
              </div>
            )}
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              Contraseña <span aria-hidden="true">*</span>
            </label>
            <div className="input-icon-wrapper">
              <input
                id="password"
                name="password"
                type={verPassword ? "text" : "password"}
                className="input-field"
                value={formData.password}
                onChange={handleChange}
                aria-required="true"
              />
              <span
                onClick={() => setVerPassword(!verPassword)}
                className="position-absolute top-50 end-0 translate-middle-y pe-3"
                style={{ cursor: "pointer" }}
                aria-label="Mostrar u ocultar contraseña"
              >
                {verPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {errors.password && (
              <div className="form-error" role="alert">
                <FaExclamationCircle className="icono-error" />{" "}
                {errors.password}
              </div>
            )}
          </div>

          {errors.general && (
            <div className="form-error mt-2 text-center" role="alert">
              <FaExclamationCircle className="icono-error" /> {errors.general}
            </div>
          )}

          <p className="forgot-password">
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => navigate("/recuperar-password")}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>

          <button type="submit" className="btn btn-outline-dark w-100 mt-2">
            <FaLock className="me-2" /> Entrar
          </button>

          <p className="register-prompt mt-3 d-md-none text-center">
            ¿No tienes cuenta?
            <span
              className="register-link"
              onClick={() => navigate("/registro")}
              role="link"
            >
              Regístrate
            </span>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;
