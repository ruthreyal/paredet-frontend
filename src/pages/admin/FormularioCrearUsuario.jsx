import React, { useState } from "react";
import UsuarioForm from "../../components/UsuarioForm";
import FormularioContraseñaNueva from "../../components/FormularioContraseñaNueva";
import registroService from "../../services/registroService";

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

    if (formData.password !== formData.repetirPassword) {
      setMensaje("Las contraseñas no coinciden");
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

      // limpiar campos
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

    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <form onSubmit={handleCrearUsuario} className="mb-4">
      <UsuarioForm
        formData={formData}
        handleChange={handleChange}
        readonlyEmail={false}
        paisesConCiudades={[]}
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
      {mensaje && <p className="mt-2">{mensaje}</p>}
      <button type="submit" className="btn-acceso mt-3">
        Guardar usuario
      </button>
    </form>
  );
};

export default FormularioCrearUsuario;
