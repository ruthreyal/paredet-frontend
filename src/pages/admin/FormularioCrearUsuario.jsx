import React, { useState } from "react";
import UsuarioForm from "../../components/UsuarioForm";
import FormularioContraseñaNueva from "../../components/FormularioContraseñaNueva";
import registroService from "../../services/registroService";
import "../../styles/formularios.css";

const FormularioCrearUsuario = ({ onUsuarioCreado, token }) => {
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
    rol: "USER"
  });

  const [verPassword, setVerPassword] = useState(false);
  const [verRepetir, setVerRepetir] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();

    // Validaciones de campos obligatorios
    if (!formData.nombre.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formData.nombre)) {
      setMensaje("El nombre solo debe contener letras.");
      return;
    }

    if (!formData.apellido.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formData.apellido)) {
      setMensaje("El apellido solo debe contener letras.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMensaje("Introduce un email válido.");
      return;
    }

    if (formData.password.length < 8 || !/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      setMensaje("La contraseña debe tener al menos 8 caracteres, una letra y un número.");
      return;
    }

    if (formData.password !== formData.repetirPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    if (!/^\d{9}$/.test(formData.telefono)) {
      setMensaje("El teléfono debe tener exactamente 9 dígitos.");
      return;
    }

    if (formData.codigoPostal && formData.codigoPostal.length > 10) {
      setMensaje("El código postal no puede tener más de 10 caracteres.");
      return;
    }

    const payload = {
      ...formData,
      rol: { nombre: formData.rol }
    };
    delete payload.repetirPassword;

    try {
      await registroService.registerConToken(payload, token);
      setMensaje("Usuario creado correctamente");

      // Limpiar campos tras éxito
      setFormData({
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
        rol: "USER"
      });

      if (onUsuarioCreado) onUsuarioCreado();
    } catch (error) {
      setMensaje("Error al crear el usuario");
      console.error("Error:", error.response?.data || error.message);
    }

    setTimeout(() => setMensaje(""), 4000);
  };

  return (
    <form onSubmit={handleCrearUsuario} aria-label="Formulario para crear nuevo usuario" className="mb-4 formulario-panel-admin">
      <UsuarioForm
        formData={formData}
        handleChange={handleChange}
        readonlyEmail={false}
        paisesConCiudades={{}} // opcional si quieres mantenerlo vacío
        isAdmin={true}
      />
      <FormularioContraseñaNueva
        password={formData.password}
        repetirPassword={formData.repetirPassword}
        verPassword={verPassword}
        setVerPassword={setVerPassword}
        verRepetir={verRepetir}
        setVerRepetir={setVerRepetir}
        handleChange={handleChange}
      />
      {mensaje && (
        <div className="alerta-clara mt-3" role="status" aria-live="polite">
          {mensaje}
        </div>
      )}
      <button type="submit" className="btn-gold mt-3 w-100">
        Guardar usuario
      </button>
    </form>
  );
};

export default FormularioCrearUsuario;

