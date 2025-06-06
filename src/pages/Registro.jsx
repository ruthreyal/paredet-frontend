import React, { useState, useContext } from "react";
import "../styles/formularios.css";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import registroService from "../services/registroService";
import { AuthContext } from "../context/AuthContext";
import UsuarioForm from "../components/UsuarioForm";
import FormularioContraseñaNueva from "../components/FormularioContraseñaNueva";
import AlertaToast from "../components/AlertaToast";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    repetirPassword: "",
    telefono: "",
    direccion: "",
    pais: "",
    ciudad: "",
    codigoPostal: "",
    rol: "USER",
  });

  const [errors, setErrors] = useState({});
  const [verPassword, setVerPassword] = useState(false);
  const [verRepetir, setVerRepetir] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "elegante",
  });

  const validarFormulario = async () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formData.nombre)) {
      nuevosErrores.nombre = "El nombre solo debe contener letras.";
    } else if (formData.nombre.length > 20) {
      nuevosErrores.nombre = "El nombre no puede tener más de 20 caracteres.";
    }

    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formData.apellido)) {
      nuevosErrores.apellido = "El apellido solo debe contener letras.";
    } else if (formData.apellido.length > 20) {
      nuevosErrores.apellido =
        "El apellido no puede tener más de 20 caracteres.";
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = "El email es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = "Introduce un email válido.";
    } else {
      const existe = await registroService.emailExiste(formData.email);
      if (existe) {
        nuevosErrores.email = "Ya existe una cuenta con este email.";
      }
    }

    if (!formData.repetirPassword) {
      nuevosErrores.repetirPassword = "Debes repetir la contraseña.";
    } else if (formData.password !== formData.repetirPassword) {
      nuevosErrores.repetirPassword = "Las contraseñas no coinciden.";
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    } else if (!/^\d{9}$/.test(formData.telefono)) {
      nuevosErrores.telefono =
        "El teléfono debe tener exactamente 9 dígitos numéricos.";
    }

    if (formData.direccion.length > 100) {
      nuevosErrores.direccion =
        "La dirección no puede tener más de 100 caracteres.";
    }

    if (formData.ciudad.length > 50) {
      nuevosErrores.ciudad = "La ciudad no puede tener más de 50 caracteres.";
    }

    if (formData.pais.length > 50) {
      nuevosErrores.pais = "El país no puede tener más de 50 caracteres.";
    }

    if (formData.codigoPostal) {
      if (formData.codigoPostal.length > 10) {
        nuevosErrores.codigoPostal =
          "El código postal no puede tener más de 10 caracteres.";
      } else if (!/^\d+$/.test(formData.codigoPostal)) {
        nuevosErrores.codigoPostal =
          "El código postal solo debe contener números.";
      }
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = await validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      console.log("Errores generados:", nuevosErrores);
      return;
    }

    const usuarioARegistrar = {
      ...formData,
      rol: { nombre: formData.rol },
    };
    delete usuarioARegistrar.repetirPassword;

    try {
      const token = await registroService.registerPublic(usuarioARegistrar);
      login(token);
      setToast({
        mostrar: true,
        mensaje: "Usuario registrado con éxito",
        tipo: "elegante",
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data?.mensaje) {
        setErrors({ general: error.response.data.mensaje });
      } else {
        setErrors({ general: "Error al registrar. Verifica los datos." });
      }
    }
  };

  return (
    <>
      <AlertaToast
        mostrar={toast.mostrar}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
        titulo="¡Registro exitoso!"
        mensaje={toast.mensaje}
        tipo={toast.tipo}
      />
      <main
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh", paddingTop: "3rem", paddingBottom: "3rem" }}
      >
        <section
          className="form-box d-flex flex-column justify-content-between"
          style={{ maxWidth: "500px", width: "100%" }}
          aria-labelledby="registro"
        >
          <h2 id="registro" className="section-title">
            Formulario de registro
          </h2>
          <form
            onSubmit={handleSubmit}
            aria-label="Formulario de registro de usuario"
            noValidate
          >
            <UsuarioForm
              formData={formData}
              handleChange={handleChange}
              readonlyEmail={false}
              isAdmin={false}
              errors={errors}
              onSubmit={handleSubmit}
              noValidate
            />

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

            <button type="submit" className="btn btn-outline-dark w-100 mt-2">
              <FaUserPlus className="me-2" /> Registrarse
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default Registro;
