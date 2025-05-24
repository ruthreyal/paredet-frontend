import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import FormularioContraseñaNueva from "../components/FormularioContraseñaNueva";
import { FaExclamationCircle } from "react-icons/fa";
import "../styles/formularios.css";

const RestablecerPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    repetirPassword: ""
  });
  const [verPassword, setVerPassword] = useState(false);
  const [verRepetir, setVerRepetir] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get("token");
    if (!tokenParam) {
      setMensaje("Token inválido.");
    } else {
      setToken(tokenParam);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (
      formData.password.length < 8 ||
      !/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)
    ) {
      nuevosErrores.password =
        "La contraseña debe tener al menos 8 caracteres, una letra y un número.";
    }

    if (formData.password !== formData.repetirPassword) {
      nuevosErrores.repetirPassword = "Las contraseñas no coinciden.";
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      setMensaje("");
      return;
    }

    try {
      await authService.restablecerPassword(token, formData.password);
      setMensaje("Contraseña actualizada correctamente.");
      setErrors({});
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      setMensaje("El enlace ha expirado o el token no es válido.");
    }
  };

  return (
    <main
      className="container login container"
      style={{ minHeight: "80vh", paddingTop: "3rem", paddingBottom: "3rem" }}
    >
      <section
        className="form-box"
        style={{ maxWidth: "500px", width: "100%" }}
        aria-labelledby="restablecer-password"
      >
        <h2 id="restablecer-password" className="section-title">
          Establecer nueva contraseña
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <FormularioContraseñaNueva
            password={formData.password}
            repetirPassword={formData.repetirPassword}
            verPassword={verPassword}
            setVerPassword={setVerPassword}
            verRepetir={verRepetir}
            setVerRepetir={setVerRepetir}
            handleChange={handleChange}
            errors={errors}
          />

          <div className="mb-3">
            <button className="btn btn-outline-dark w-100" type="submit">
              Guardar nueva contraseña
            </button>
          </div>

          {mensaje && (
            <div
              className={`mt-3 text-center ${
                mensaje.includes("correctamente")
                  ? "form-success"
                  : "form-error"
              }`}
              role="status"
            >
              <FaExclamationCircle className="icono-error" /> {mensaje}
            </div>
          )}
        </form>
      </section>
    </main>
  );
};

export default RestablecerPassword;

