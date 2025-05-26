import React, { useState } from "react";
import registroService from "../services/registroService";
import authService from "../services/authService";
import { FaExclamationCircle } from "react-icons/fa";
import "../styles/formularios.css";

const RecuperarPassword = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errors, setErrors] = useState({});

  const validar = () => {
    const nuevosErrores = {};
    if (!/\S+@\S+\.\S+/.test(email)) {
      nuevosErrores.email = "Introduce un email válido.";
    }
    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(""); // Limpia mensaje anterior
    const nuevosErrores = validar();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    try {
      console.log("📩 Comprobando si existe el email:", email);
      const existe = await registroService.emailExiste(email);

      if (!existe) {
        setErrors({
          email: "El email no corresponde a ningún usuario registrado.",
        });
        return;
      }

      console.log("✅ Email válido, enviando solicitud de recuperación...");

      await authService.solicitarRecuperacion(email);

      setMensaje("Enlace de recuperación enviado al correo indicado.");
      setErrors({});
      setTimeout(() => setMensaje(""), 3000);

    } catch (error) {
  console.error("❌ Error al solicitar recuperación:", error);

  const mensajeError =
    error.response?.data?.error || 
    error.response?.data?.mensaje || 
    "Ha ocurrido un error al procesar la solicitud.";

  setMensaje(mensajeError);
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
        aria-labelledby="recuperar-password"
      >
        <h2 id="recuperar-password" className="section-title">
          Recuperar contraseña
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email">
              Email <span aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-required="true"
            />
            {errors.email && (
              <div className="form-error" role="alert">
                <FaExclamationCircle className="icono-error" /> {errors.email}
              </div>
            )}
          </div>
          <div className="mb-3">
            <button className="btn btn-outline-dark w-100" type="submit">
              Enviar enlace
            </button>
          </div>
          {mensaje && (
            <div className="form-success mt-3 text-center" role="status">
              {mensaje}
            </div>
          )}
        </form>
      </section>
    </main>
  );
};

export default RecuperarPassword;

