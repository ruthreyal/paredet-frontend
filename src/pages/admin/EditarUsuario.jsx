import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usuarioService from "../../services/usuarioService";
import UsuarioForm from "../../components/UsuarioForm";
import FormularioContraseñaNueva from "../../components/FormularioContraseñaNueva";
import "../../styles/formularios.css";

const EditarUsuario = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [verRepetir, setVerRepetir] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const data = await usuarioService.getUsuarioPorEmail(email, token);
        setFormData({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          email: data.email || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          pais: data.pais || "",
          ciudad: data.ciudad || "",
          codigoPostal: data.codigoPostal || "",
          rol: { nombre: data.rolNombre || "USER" },
          password: "",
          repetirPassword: "",
        });
      } catch {
        mostrarMensaje("Error al cargar usuario.");
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [email, token]);

  const mostrarMensaje = (msg) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(""), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    // Validaciones sincrónicas
    if (
      !formData.nombre.trim() ||
      !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formData.nombre)
    ) {
      nuevosErrores.nombre = "El nombre solo debe contener letras.";
    }

    if (
      !formData.apellido.trim() ||
      !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formData.apellido)
    ) {
      nuevosErrores.apellido = "El apellido solo debe contener letras.";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = "Introduce un email válido.";
    }

    if (!/^\d{9}$/.test(formData.telefono)) {
      nuevosErrores.telefono = "El teléfono debe tener exactamente 9 dígitos.";
    }

    if (formData.codigoPostal && formData.codigoPostal.length > 10) {
      nuevosErrores.codigoPostal =
        "El código postal no puede tener más de 10 caracteres.";
    }

    if (mostrarPassword) {
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
    }

    // Si hay errores sincrónicos, los mostramos antes de seguir
    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    // Validación asíncrona del email si ha sido modificado
    if (formData.email !== email) {
      try {
        const existe = await usuarioService.emailExiste(formData.email, token);
        if (existe) {
          setErrors({ email: "Ya existe un usuario con este email." });
          return;
        }
      } catch {
        setErrors({ email: "Error al comprobar el email." });
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        rol: formData.rol ? { nombre: formData.rol.nombre || "USER" } : null,
      };
      delete payload.repetirPassword;

      await usuarioService.actualizarUsuario(email, payload, token);
      mostrarMensaje("Usuario actualizado correctamente.");
      setTimeout(() => navigate("/admin/usuarios"), 2000);
    } catch {
      mostrarMensaje("Error al actualizar usuario.");
    }
  };

  const handleEliminar = async () => {
    const confirmacion = window.confirm(
      "¿Estás segura de que deseas eliminar este usuario? Esta acción no se puede deshacer."
    );
    if (!confirmacion) return;

    try {
      await usuarioService.eliminarUsuario(email, token);
      navigate("/admin/usuarios");
    } catch {
      mostrarMensaje("Error al eliminar usuario.");
    }
  };

  if (loading)
    return <p className="text-center mt-4">Cargando formulario...</p>;
  if (!formData)
    return (
      <p className="text-center mt-4 text-danger">
        No se pudo cargar el formulario
      </p>
    );

  return (
    <section className="form-box formulario-panel-admin">
      <div className="header-flex mb-5">
        <h2 className="section-title mb-0">Perfil</h2>
        <button
          className="btn btn-outline-dark w-40 mt-2"
          onClick={() => navigate("/admin/usuarios")}
          aria-label="Cancelar"
        >
          Cancelar
        </button>
      </div>

      {mensaje && (
        <div className="alerta-clara mb-3" role="status" aria-live="polite">
          {mensaje}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        aria-label="Formulario de edición de usuario"
        className="formulario-panel-admin"
      >
        <UsuarioForm
          formData={formData}
          handleChange={handleChange}
          readonlyEmail={false}
          paisesConCiudades={{}}
          isAdmin={true}
          errors={errors}
        />

        <p
          className="cambiar-password-toggle"
          onClick={() => setMostrarPassword(!mostrarPassword)}
          aria-expanded={mostrarPassword}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            setMostrarPassword(!mostrarPassword)
          }
        >
          {mostrarPassword ? "Ocultar contraseña ▲" : "Cambiar contraseña ▼"}
        </p>

        {mostrarPassword && (
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
        )}

        <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
          <button type="submit" className="btn btn-outline-dark w-100 mt-2">
            Guardar cambios
          </button>

          <button
            type="button"
            className="btn-gold w-100"
            onClick={handleEliminar}
            aria-label="Eliminar usuario"
          >
            Eliminar usuario
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditarUsuario;
