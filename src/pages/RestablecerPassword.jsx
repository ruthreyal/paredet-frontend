import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import FormularioContraseñaNueva from "../components/FormularioContraseñaNueva";
import AlertaToast from "../components/AlertaToast";
import "../styles/formularios.css";

const RestablecerPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    repetirPassword: ""
  });
  const [verPassword, setVerPassword] = useState(false);
  const [verRepetir, setVerRepetir] = useState(false);
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState("");
  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "info",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const mostrarToast = (mensaje, tipo = "info") => {
    setToast({ mostrar: true, mensaje, tipo });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, mostrar: false }));
    }, 4000);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get("token");
    if (!tokenParam) {
      mostrarToast("Token inválido.", "error");
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
      return;
    }

    try {
      await authService.restablecerPassword(token, formData.password);
      setErrors({});
      mostrarToast("Contraseña actualizada correctamente.", "success");
      setTimeout(() => navigate("/login"), 4000);
    } catch {
      mostrarToast("El enlace ha expirado.", "error");
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
        </form>
      </section>
    </main>
  );
};

export default RestablecerPassword;


