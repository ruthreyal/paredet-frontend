import React, { useEffect, useState } from "react";
import usuarioService from "../services/usuarioService";
import axios from "axios";
import { FaSave, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "../services/apiConfig";
import UsuarioForm from "../components/UsuarioForm";
import FormularioCambiarContraseña from "../components/FormularioCambiarContraseña";
import "../styles/formularios.css";

const PerfilPage = () => {
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [verActual, setVerActual] = useState(false);
  const [verNueva, setVerNueva] = useState(false);

  const token = localStorage.getItem("token");
  let email = null;

  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      email = payload?.sub || null;
    }
  } catch {
    console.error("Error al extraer email del token.");
  }

  const paisesConCiudades = {
    España: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao"],
    Portugal: ["Lisboa", "Oporto", "Coímbra", "Braga"],
    Francia: ["París", "Lyon", "Marsella", "Toulouse"],
    Italia: ["Roma", "Milán", "Florencia", "Venecia"],
    Inglaterra: ["Londres", "Manchester", "Birmingham", "Liverpool"]
  };

  useEffect(() => {
    if (!email || !token) return;
    usuarioService
      .getUsuarioPorEmail(email, token)
      .then(setUsuario)
      .catch(() => mostrarMensaje("Error al cargar los datos del usuario"));
  }, [email, token]);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 3000);
  };

  const handleChange = (e) => {
    setUsuario((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!/^\d{9}$/.test(usuario.telefono)) {
      return mostrarMensaje("El teléfono debe tener exactamente 9 dígitos.");
    }

    if (usuario.codigoPostal && usuario.codigoPostal.length > 10) {
      return mostrarMensaje("El código postal no puede tener más de 10 caracteres.");
    }

    try {
      await axios.put(`${API_BASE_URL}/usuarios/email/${usuario.email}`, usuario, {
        headers: { Authorization: `Bearer ${token}` }
      });
      mostrarMensaje("Datos actualizados correctamente");
    } catch {
      mostrarMensaje("Error al actualizar los datos");
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();

    if (!contrasenaActual || !nuevaPassword) {
      return mostrarMensaje("Debes completar ambos campos de contraseña.");
    }

    if (nuevaPassword.length < 6) {
      return mostrarMensaje("La nueva contraseña debe tener al menos 6 caracteres.");
    }

    try {
      await axios.put(
        `${API_BASE_URL}/usuarios/email/${email}/cambiar-password`,
        { actual: contrasenaActual, nueva: nuevaPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensaje("Contraseña actualizada correctamente");
      setContrasenaActual("");
      setNuevaPassword("");
    } catch {
      mostrarMensaje("La contraseña actual no es correcta");
    }
  };

  const handleEliminarCuenta = async () => {
    if (!window.confirm("¿Estás segura de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) return;

    try {
      await axios.delete(`${API_BASE_URL}/usuarios/email/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch {
      mostrarMensaje("Error al eliminar la cuenta");
    }
  };

  if (!usuario || typeof usuario !== "object") {
    return <p className="text-center mt-5">Cargando...</p>;
  }

  return (
    <main className="container form-container py-5">
      <section className="form-box" style={{ maxWidth: "500px", width: "100%" }}>
        <h2>Mi perfil</h2>

        <form onSubmit={handleGuardar} aria-label="Formulario de actualización de perfil">
          <UsuarioForm
            formData={usuario}
            handleChange={handleChange}
            readonlyEmail={true}
            paisesConCiudades={paisesConCiudades}
          />
          <button type="submit" className="btn btn-gold w-100 mb-3">
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
        />

        <hr className="my-4" />

        <button
          className="btn-claro-inverso"
          onClick={handleEliminarCuenta}
          aria-label="Eliminar cuenta"
        >
          <FaTrash className="me-2" /> Eliminar cuenta
        </button>

        {mensaje && (
          <div className="alerta-clara mt-3" role="status" aria-live="polite">
            {mensaje}
          </div>
        )}
      </section>
    </main>
  );
};

export default PerfilPage;





