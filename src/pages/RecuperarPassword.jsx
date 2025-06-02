import React, { useState } from "react";
import registroService from "../services/registroService";
import authService from "../services/authService";
import { FaExclamationCircle } from "react-icons/fa";
import AlertaToast from "../components/AlertaToast";
import "../styles/formularios.css";

const RecuperarPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "info",
  });

  const mostrarToast = (mensaje, tipo = "info") => {
    setToast({ mostrar: true, mensaje, tipo });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, mostrar: false }));
    }, 4000);
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!/\S+@\S+\.\S+/.test(email)) {
      nuevosErrores.email = "Introduce un email válido.";
    }
    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validar();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    try {
      const existe = await registroService.emailExiste(email);
      if (!existe) {
        setErrors({
          email: "El email no corresponde a ningún usuario registrado.",
        });
        return;
      }

      await authService.solicitarRecuperacion(email);
      setErrors({});
      setEmail("");
      mostrarToast("Enlace de recuperación enviado al correo indicado.", "elegante");
    } catch (error) {
      const mensajeError =
        error.response?.data?.error ||
        error.response?.data?.mensaje ||
        "Ha ocurrido un error al procesar la solicitud.";
      mostrarToast(mensajeError, "error");
    }
  };

  return (
    <main
      className="container login container"
      style={{ minHeight: "80vh", paddingTop: "3rem", paddingBottom: "3rem" }}
    >
      <AlertaToast
        mostrar={toast.mostrar}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
        titulo="Notificación"
        mensaje={toast.mensaje}
        tipo={toast.tipo}
      />

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
        </form>
      </section>
    </main>
  );
};

export default RecuperarPassword;


