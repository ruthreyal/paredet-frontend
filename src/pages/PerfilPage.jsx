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

const PerfilPage = () => {
  const [usuario, setUsuario] = useState(null);
  const [email, setEmail] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [errors, setErrors] = useState({});
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [verActual, setVerActual] = useState(false);
  const [verNueva, setVerNueva] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const extractedEmail = payload?.sub || null;
        setEmail(extractedEmail);
      } catch {
        console.error("Error al extraer email del token.");
      }
    }
  }, [token]);

  useEffect(() => {
    if (!email || !token) return;
    usuarioService
      .getUsuarioPorEmail(email, token)
      .then(setUsuario)
      .catch(() =>
        mostrarMensaje("Error al cargar los datos del usuario", "error")
      );
  }, [email, token]);

  const mostrarMensaje = (texto, tipo = "info") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => {
      setMensaje("");
    }, 3000);
  };

  const handleChange = (e) => {
    setUsuario((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    const nuevosErrores = {};

    if (
      !usuario.nombre.trim() ||
      !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(usuario.nombre)
    ) {
      nuevosErrores.nombre = "El nombre solo debe contener letras.";
    }

    if (
      !usuario.apellido.trim() ||
      !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(usuario.apellido)
    ) {
      nuevosErrores.apellido = "El apellido solo debe contener letras.";
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

    if (usuario.codigoPostal.length > 10) {
      nuevosErrores.codigoPostal =
        "El código postal no puede tener más de 10 caracteres.";
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
      mostrarMensaje("Datos actualizados correctamente", "success");
    } catch {
      mostrarMensaje("Error al actualizar los datos", "error");
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();

    if (!contrasenaActual || !nuevaPassword) {
      return mostrarMensaje("Debes completar ambos campos de contraseña.", "error");
    }

    if (nuevaPassword.length < 6) {
      return mostrarMensaje(
        "La nueva contraseña debe tener al menos 6 caracteres.",
        "error"
      );
    }

    try {
      await axios.put(
        `${API_BASE_URL}/usuarios/email/${email}/cambiar-password`,
        { actual: contrasenaActual, nueva: nuevaPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensaje("Contraseña actualizada correctamente", "success");
      setContrasenaActual("");
      setNuevaPassword("");
    } catch {
      mostrarMensaje("La contraseña actual no es correcta", "error");
    }
  };

  const handleEliminarCuenta = async () => {
    if (
      !window.confirm(
        "¿Estás segura de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
      )
    )
      return;

    try {
      await axios.delete(`${API_BASE_URL}/usuarios/email/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch {
      mostrarMensaje("Error al eliminar la cuenta", "error");
    }
  };

  if (!usuario) {
    return <p className="text-center mt-5">Cargando...</p>;
  }

  return (
    <main className="container form-container py-5">
      <section className="form-box" style={{ maxWidth: "500px", width: "100%" }}>
        <h2>Mi perfil</h2>

        <form
          onSubmit={handleGuardar}
          aria-label="Formulario de actualización de perfil"
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

        {mensaje && (
          <div className={`alerta-${tipoMensaje} mt-3`} role="status" aria-live="polite">
            {mensaje}
          </div>
        )}

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
        />

        <hr className="my-4" />

        <FormularioCambiarEmail emailActual={usuario.email} />

        <hr className="my-4" />

        <button
          className="btn-claro-inverso"
          onClick={handleEliminarCuenta}
          aria-label="Eliminar cuenta"
        >
          <FaTrash className="me-2" /> Eliminar cuenta
        </button>
      </section>
    </main>
  );
};

export default PerfilPage;

