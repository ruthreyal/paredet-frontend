import React, { useEffect, useState } from "react";
import UsuarioForm from "../../components/UsuarioForm";
import FormularioContraseñaNueva from "../../components/FormularioContraseñaNueva";
import registroService from "../../services/registroService";
import usuarioService from "../../services/usuarioService";
import "../../styles/formularios.css";

const FormularioCrearUsuario = ({
  usuarioInicial,
  onUsuarioGuardado,
  onCancelar,
  token,
}) => {
  const esEdicion = Boolean(usuarioInicial);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    repetirPassword: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    pais: "",
    rol: "USER",
  });

  const [verPassword, setVerPassword] = useState(false);
  const [verRepetir, setVerRepetir] = useState(false);
  const [errors, setErrors] = useState({});
  const [mostrarPassword, setMostrarPassword] = useState(false);

  useEffect(() => {
    if (usuarioInicial) {
      setFormData({
        ...usuarioInicial,
        rol: usuarioInicial.rolNombre || "USER",
        password: "",
        repetirPassword: "",
      });
    }
  }, [usuarioInicial]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    // Validaciones generales
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
    } else {
      try {
        const existe = await registroService.emailExiste(formData.email);
        if (!esEdicion && existe) {
          nuevosErrores.email = "Ya existe una cuenta con este email.";
        }

        if (esEdicion && formData.email !== usuarioInicial.email && existe) {
          nuevosErrores.email = "Ya existe una cuenta con este email.";
        }
      } catch {
        nuevosErrores.email = "Error al comprobar el email.";
      }
    }

    if (!/^\d{9}$/.test(formData.telefono)) {
      nuevosErrores.telefono = "El teléfono debe tener exactamente 9 dígitos.";
    }

    if (formData.codigoPostal && formData.codigoPostal.length > 10) {
      nuevosErrores.codigoPostal =
        "El código postal no puede tener más de 10 caracteres.";
    }

    if (!esEdicion || mostrarPassword) {
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

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    setErrors({});

    const payload = {
      ...formData,
      rol: { nombre: formData.rol },
    };
    delete payload.repetirPassword;

    try {
      if (esEdicion) {
        await usuarioService.actualizarUsuario(
          usuarioInicial.email,
          payload,
          token
        );
        setErrors({ exito: "Usuario actualizado correctamente." });
      } else {
        await registroService.registerConToken(payload, token);
        setErrors({ exito: "Usuario creado correctamente." });
      }

      if (onUsuarioGuardado) onUsuarioGuardado();
    } catch (error) {
      setErrors({ general: "Error al guardar el usuario." });
      console.error("Error:", error.response?.data || error.message);
    }

    setTimeout(() => setErrors({}), 4000);
  };

  const handleEliminar = async () => {
    const confirmacion = window.confirm(
      "¿Estás segura de que deseas eliminar este usuario?"
    );
    if (!confirmacion) return;

    try {
      await usuarioService.eliminarUsuario(usuarioInicial.email, token);
      if (onUsuarioGuardado) onUsuarioGuardado();
    } catch (error) {
      setErrors({ general: "Error al eliminar el usuario." });
      console.error(
        "Error al eliminar:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <section className="form-box formulario-panel-admin">
      <div className="header-flex mb-5">
        <h2 className="section-title mb-0">
          {esEdicion ? "Perfil" : "Registro"}
        </h2>
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="btn btn-outline-dark w-40 mt-2"
            aria-label="Cancelar"
          >
            Cancelar
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        aria-label="Formulario usuario"
        className="mb-4 formulario-panel-admin"
      >
        <UsuarioForm
          formData={formData}
          handleChange={handleChange}
          readonlyEmail={false}
          paisesConCiudades={{}}
          isAdmin={true}
          errors={errors}
        />

        {esEdicion && (
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
        )}

        {(!esEdicion || mostrarPassword) && (
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

        {errors.general && (
          <div className="alerta-clara mt-3" role="status" aria-live="polite">
            {errors.general}
          </div>
        )}

        {errors.exito && (
          <div className="alerta-exito mt-3" role="status" aria-live="polite">
            {errors.exito}
          </div>
        )}

        <button type="submit" className="btn btn-outline-dark w-100">
          {esEdicion ? "Guardar cambios" : "Guardar usuario"}
        </button>
        {esEdicion && (
          <button
            type="button"
            className="btn btn-dark w-100 mt-4"
            onClick={handleEliminar}
            aria-label="Eliminar usuario"
          >
            Eliminar usuario
          </button>
        )}
      </form>
    </section>
  );
};

export default FormularioCrearUsuario;
