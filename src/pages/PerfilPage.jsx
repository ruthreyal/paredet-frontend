import React, { useEffect, useState } from "react";
import usuarioService from "../services/usuarioService";
import axios from "axios";
import { FaSave, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "../services/apiConfig";
import UsuarioForm from "../components/UsuarioForm";
import FormularioCambiarContraseña from "../components/FormularioCambiarContraseña";
import "../styles/login.css";

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
      .catch(() => {
        setMensaje("Error al cargar los datos del usuario");
        setTimeout(() => setMensaje(""), 3000);
      });
  }, [email, token]);

  const handleChange = (e) => {
    setUsuario((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!/^\d{9}$/.test(usuario.telefono)) {
      setMensaje("El teléfono debe tener exactamente 9 dígitos.");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    if (usuario.codigoPostal && usuario.codigoPostal.length > 10) {
      setMensaje("El código postal no puede tener más de 10 caracteres.");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/usuarios/email/${usuario.email}`, usuario, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensaje("Datos actualizados correctamente");
    } catch {
      setMensaje("Error al actualizar los datos");
    } finally {
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    if (!contrasenaActual || !nuevaPassword) {
      setMensaje("Debes completar ambos campos de contraseña.");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    if (nuevaPassword.length < 6) {
      setMensaje("La nueva contraseña debe tener al menos 6 caracteres.");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/usuarios/email/${email}/cambiar-password`,
        { actual: contrasenaActual, nueva: nuevaPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje("Contraseña actualizada correctamente");
      setContrasenaActual("");
      setNuevaPassword("");
    } catch {
      setMensaje("La contraseña actual no es correcta");
    } finally {
      setTimeout(() => setMensaje(""), 3000);
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
      setMensaje("Error al eliminar la cuenta");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  if (!usuario || typeof usuario !== "object") {
    return <p className="text-center mt-5">Cargando...</p>;
  }

  return (
    <main className="container login-container py-5">
      <section className="login-box" style={{ maxWidth: "500px", width: "100%" }}>
        <h2>Mi perfil</h2>

        <form onSubmit={handleGuardar}>
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

        <button className="btn btn-outline-danger w-100" onClick={handleEliminarCuenta}>
          <FaTrash className="me-2" /> Eliminar cuenta
        </button>

        {mensaje && (
          <div className="alert-elegante mt-3" role="alert">
            {mensaje}
          </div>
        )}
      </section>
    </main>
  );
};

export default PerfilPage;




