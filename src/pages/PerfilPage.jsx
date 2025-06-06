import React, { useEffect, useState } from "react";
import usuarioService from "../services/usuarioService";
import axios from "axios";
import { FaSave, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "../services/apiConfig";
import UsuarioForm from "../components/UsuarioForm";
import FormularioCambiarContraseña from "../components/FormularioCambiarContraseña";
import FormularioCambiarEmail from "../components/FormularioCambiarEmail";
import paisesConCiudades from "../data/cities.json";
import "../styles/formularios.css";
import AlertaToast from "../components/AlertaToast";

const PerfilPage = () => {
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [email, setEmail] = useState(null);
  const [errors, setErrors] = useState({});
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [verActual, setVerActual] = useState(false);
  const [verNueva, setVerNueva] = useState(false);

  const token = localStorage.getItem("token");
  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "elegante",
  });
  const mostrarToast = (mensaje, tipo = "info") => {
    setToast({ mostrar: true, mensaje, tipo });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, mostrar: false }));
    }, 4000);
  };

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const extractedEmail = payload?.sub || null;
        setEmail(extractedEmail);
      } catch {
        mostrarToast(
          "Error al procesar tu sesión. Vuelve a iniciar sesión.",
          "error"
        );
      }
    }
  }, [token]);

  useEffect(() => {
    if (!email || !token) return;
    usuarioService
      .getUsuarioPorEmail(email, token)
      .then(setUsuario)
      .catch(() =>
        mostrarToast(
          "Error al procesar tu sesión. Vuelve a iniciar sesión.",
          "error"
        )
      );
  }, [email, token]);

  const handleChange = (e) => {
    setUsuario((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    const nuevosErrores = {};

    if (!usuario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(usuario.nombre)) {
      nuevosErrores.nombre = "El nombre solo debe contener letras.";
    } else if (usuario.nombre.length > 20) {
      nuevosErrores.nombre = "El nombre no puede tener más de 20 caracteres.";
    }

    if (!usuario.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(usuario.apellido)) {
      nuevosErrores.apellido = "El apellido solo debe contener letras.";
    } else if (usuario.apellido.length > 20) {
      nuevosErrores.apellido =
        "El apellido no puede tener más de 20 caracteres.";
    }

    if (!/^\d{9}$/.test(usuario.telefono)) {
      nuevosErrores.telefono = "El teléfono debe tener exactamente 9 dígitos.";
    }

    if (usuario.direccion.length > 100) {
      nuevosErrores.direccion =
        "La dirección no puede tener más de 100 caracteres.";
    }

    if (usuario.pais.length > 50) {
      nuevosErrores.pais = "El país no puede tener más de 50 caracteres.";
    }

    if (usuario.ciudad.length > 50) {
      nuevosErrores.ciudad = "La ciudad no puede tener más de 50 caracteres.";
    }

    if (usuario.codigoPostal) {
      if (usuario.codigoPostal.length > 10) {
        nuevosErrores.codigoPostal =
          "El código postal no puede tener más de 10 caracteres.";
      } else if (!/^\d+$/.test(usuario.codigoPostal)) {
        nuevosErrores.codigoPostal =
          "El código postal solo debe contener números.";
      }
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/usuarios/email/${usuario.email}`,
        usuario,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setErrors({});
      mostrarToast("Datos actualizados correctamente", "elegante");
    } catch {
      mostrarToast("Error al actualizar los datos", "error");
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();

    const nuevosErrores = {};

    if (!contrasenaActual.trim()) {
      nuevosErrores.contrasenaActual = "La contraseña actual es obligatoria.";
    }

    if (!nuevaPassword.trim()) {
      nuevosErrores.nuevaPassword = "La nueva contraseña es obligatoria.";
    } else if (nuevaPassword.length < 6) {
      nuevosErrores.nuevaPassword =
        "La nueva contraseña debe tener al menos 6 caracteres.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/usuarios/email/${email}/cambiar-password`,
        { actual: contrasenaActual, nueva: nuevaPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setErrors({});
      setContrasenaActual("");
      setNuevaPassword("");
      mostrarToast("Contraseña actualizada correctamente", "elegante");
    } catch {
      setErrors({
        contrasenaActual: "La contraseña actual no es correcta.",
      });
    }
  };

  const handleEliminarCuenta = () => {
    setConfirmarEliminacion(true);
  };

  const confirmarEliminarUsuario = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/usuarios/email/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch {
      mostrarToast("Error al eliminar la cuenta", "error");
    } finally {
      setConfirmarEliminacion(false);
    }
  };

  if (!usuario) {
    return <p className="text-center mt-5">Cargando...</p>;
  }

  return (
    <>
      <AlertaToast
        mostrar={toast.mostrar}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
        titulo="Notificación"
        mensaje={toast.mensaje}
        tipo={toast.tipo}
      />
      <AlertaToast
        mostrar={confirmarEliminacion}
        onCerrar={() => setConfirmarEliminacion(false)}
        mensaje="¿Estás segura de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
        tipo="error"
        autoCerrar={false}
        mostrarBotones={true}
        onAceptar={confirmarEliminarUsuario}
        onCancelar={() => setConfirmarEliminacion(false)}
      />

      <main className="container form-container py-5">
        <section
          className="form-box"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <h2>Mi perfil</h2>

          <form
            onSubmit={handleGuardar}
            aria-label="Formulario de actualización de perfil"
            noValidate
          >
            <UsuarioForm
              formData={usuario}
              handleChange={handleChange}
              readonlyEmail={true}
              paisesConCiudades={paisesConCiudades}
              errors={errors}
            />
            <button type="submit" className="btn btn-dark w-100">
              <FaSave className="me-2" /> Guardar cambios
            </button>
          </form>

          <hr className="my-4" />

          <FormularioCambiarContraseña
            contrasenaActual={contrasenaActual}
            nuevaPassword={nuevaPassword}
            verActual={verActual}
            setVerActual={setVerActual}
            verNueva={verNueva}
            setVerNueva={setVerNueva}
            handleChange={(e) => {
              const { name, value } = e.target;
              if (name === "contrasenaActual") setContrasenaActual(value);
              if (name === "nuevaPassword") setNuevaPassword(value);
            }}
            handleSubmit={handleCambiarPassword}
            errors={errors}
          />

          <hr className="my-4" />

          <FormularioCambiarEmail emailActual={usuario.email} />

          <hr className="my-4" />

          <button
            className="btn btn-outline-dark w-100"
            onClick={handleEliminarCuenta}
            aria-label="Eliminar cuenta"
          >
            <FaTrash className="me-2" /> Eliminar cuenta
          </button>
        </section>
      </main>
    </>
  );
};

export default PerfilPage;
