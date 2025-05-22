import React, { useState, useContext } from "react";
import "../styles/formularios.css";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import registroService from "../services/registroService";
import { AuthContext } from "../context/AuthContext";
import UsuarioForm from "../components/UsuarioForm";
import FormularioContraseñaNueva from "../components/FormularioContraseñaNueva";

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

  const [mensaje, setMensaje] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [verRepetir, setVerRepetir] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const paisesConCiudades = {
    España: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao"],
    Portugal: ["Lisboa", "Oporto", "Coímbra", "Braga"],
    Francia: ["París", "Lyon", "Marsella", "Toulouse"],
    Italia: ["Roma", "Milán", "Florencia", "Venecia"],
    Inglaterra: ["Londres", "Manchester", "Birmingham", "Liverpool"],
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.direccion.length > 100) {
      setMensaje("La dirección no puede tener más de 100 caracteres.");
      return;
    }

    if (formData.ciudad.length > 50) {
      setMensaje("La ciudad no puede tener más de 50 caracteres.");
      return;
    }

    if (formData.pais.length > 50) {
      setMensaje("El país no puede tener más de 50 caracteres.");
      return;
    }

    if (
      !formData.nombre.trim() ||
      !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formData.nombre)
    ) {
      setMensaje("El nombre solo debe contener letras.");
      return;
    }

    if (
      !formData.apellido.trim() ||
      !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formData.apellido)
    ) {
      setMensaje("El apellido solo debe contener letras.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMensaje("Introduce un email válido.");
      return;
    }

    if (
      formData.password.length < 8 ||
      !/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)
    ) {
      setMensaje(
        "La contraseña debe tener al menos 8 caracteres, una letra y un número."
      );
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

    const existe = await registroService.emailExiste(formData.email);
    if (existe) {
      setMensaje("Ya existe una cuenta con este email.");
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
      navigate("/");
    } catch (error) {
      setMensaje("Error al registrar. Verifica los datos.");
    }

    setTimeout(() => setMensaje(""), 4000);
  };

  return (
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
        >
          <UsuarioForm
            formData={formData}
            handleChange={handleChange}
            readonlyEmail={false}
            paisesConCiudades={paisesConCiudades}
            isAdmin={false}
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

          <button type="submit" className="btn btn-outline-dark w-100 mt-2">
            <FaUserPlus className="me-2" /> Registrarse
          </button>
        </form>
      </section>
    </main>
  );
};

export default Registro;
