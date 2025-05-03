import React, { useEffect, useState } from "react";
import usuarioService from "../services/usuarioService";
import axios from "axios";
import { FaSave, FaKey, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/login.css";
import { API_BASE_URL } from "../services/apiConfig";

const PerfilPage = () => {
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [verActual, setVerActual] = useState(false);
  const [verNueva, setVerNueva] = useState(false);
  const token = localStorage.getItem("token");
  const email = token ? JSON.parse(atob(token.split(".")[1])).sub : null;

  const paisesConCiudades = {
    España: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao"],
    Portugal: ["Lisboa", "Oporto", "Coímbra", "Braga"],
    Francia: ["París", "Lyon", "Marsella", "Toulouse"],
    Italia: ["Roma", "Milán", "Florencia", "Venecia"],
    Inglaterra: ["Londres", "Manchester", "Birmingham", "Liverpool"],
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      if (!email || !token) return;
      try {
        const datos = await usuarioService.getUsuarioPorEmail(email, token);
        setUsuario(datos);
      } catch {
        setMensaje("Error al cargar los datos del usuario");
        setTimeout(() => setMensaje(""), 3000);
      }
    };
    fetchUsuario();
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
      await axios.put(
        `${API_BASE_URL}/usuarios/email/${usuario.email}`,
        usuario,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensaje("Datos actualizados correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch {
      setMensaje("Error al actualizar los datos");
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensaje("Contraseña actualizada correctamente");
      setContrasenaActual("");
      setNuevaPassword("");
      setTimeout(() => setMensaje(""), 3000);
    } catch {
      setMensaje("La contraseña actual no es correcta");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  const handleEliminarCuenta = async () => {
    if (window.confirm("¿Estás segura de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      try {
        await axios.delete(`${API_BASE_URL}/usuarios/email/${usuario.email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.removeItem("token");
        window.location.href = "/";
      } catch {
        setMensaje("Error al eliminar la cuenta");
        setTimeout(() => setMensaje(""), 3000);
      }
    }
  };

  if (!usuario) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <main className="container login-container py-5">
      <section className="login-box" style={{ maxWidth: "500px", width: "100%" }}>
        <h2>Mi perfil</h2>
        <form onSubmit={handleGuardar}>
          <div className="mb-3">
            <label>Nombre *</label>
            <input type="text" name="nombre" value={usuario.nombre || ""} onChange={handleChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label>Apellido *</label>
            <input type="text" name="apellido" value={usuario.apellido || ""} onChange={handleChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label>Email *</label>
            <input type="email" name="email" value={usuario.email || ""} className="form-control" readOnly />
          </div>

          <div className="mb-3">
            <label>Teléfono *</label>
            <input type="tel" name="telefono" value={usuario.telefono || ""} onChange={handleChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label>Dirección</label>
            <input type="text" name="direccion" value={usuario.direccion || ""} onChange={handleChange} className="form-control" />
          </div>

          <div className="mb-3">
            <label>País</label>
            <select name="pais" value={usuario.pais || ""} onChange={handleChange} className="form-control">
              <option value="">Selecciona un país</option>
              {Object.keys(paisesConCiudades).map((pais) => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
            </select>
          </div>

          {usuario.pais && (
            <div className="mb-3">
              <label>Ciudad</label>
              <select name="ciudad" value={usuario.ciudad || ""} onChange={handleChange} className="form-control">
                <option value="">Selecciona una ciudad</option>
                {paisesConCiudades[usuario.pais].map((ciudad) => (
                  <option key={ciudad} value={ciudad}>{ciudad}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-3">
            <label>Código Postal</label>
            <input type="text" name="codigoPostal" value={usuario.codigoPostal || ""} onChange={handleChange} className="form-control" />
          </div>

          <button type="submit" className="btn btn-gold w-100">
            <FaSave className="me-2" /> Guardar cambios
          </button>
        </form>

        <hr className="my-4" />

        <form onSubmit={handleCambiarPassword}>
          <h5 className="mb-3">Cambiar contraseña</h5>

          <div className="mb-3 position-relative">
            <label>Contraseña actual</label>
            <input
              type={verActual ? "text" : "password"}
              className="form-control"
              value={contrasenaActual}
              onChange={(e) => setContrasenaActual(e.target.value)}
            />
            <span
              onClick={() => setVerActual(!verActual)}
              className="position-absolute top-50 end-0 translate-middle-y pe-3"
              style={{ cursor: "pointer" }}
            >
              {verActual ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="mb-3 position-relative">
            <label>Nueva contraseña</label>
            <input
              type={verNueva ? "text" : "password"}
              className="form-control"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              minLength={6}
            />
            <span
              onClick={() => setVerNueva(!verNueva)}
              className="position-absolute top-50 end-0 translate-middle-y pe-3"
              style={{ cursor: "pointer" }}
            >
              {verNueva ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="btn btn-dark w-100">
            <FaKey className="me-2" /> Cambiar contraseña
          </button>
        </form>

        <hr className="my-4" />

        <button className="btn btn-outline-danger w-100" onClick={handleEliminarCuenta}>
          <FaTrash className="me-2" /> Eliminar mi cuenta
        </button>

        {mensaje && (
          <div className="alert-elegante" role="alert">
            {mensaje}
          </div>
        )}
      </section>
    </main>
  );
};

export default PerfilPage;


