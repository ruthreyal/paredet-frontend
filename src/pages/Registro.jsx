import React, { useState, useContext } from "react";
import "../styles/login.css";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import registroService from "../services/registroService";
import { AuthContext } from "../context/AuthContext";
import UsuarioForm from "../components/UsuarioForm";

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

    const usuarioARegistrar = { ...formData };
    delete usuarioARegistrar.repetirPassword;

    try {
      const token = await registroService.register(usuarioARegistrar);
      login(token);
      navigate("/");
    } catch (error) {
      setMensaje("Error al registrar. Verifica los datos.");
    }
  };

  return (
    <main className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", paddingTop: "3rem", paddingBottom: "3rem" }}>
      <section className="login-box d-flex flex-column justify-content-between" style={{ maxWidth: "500px", width: "100%" }} aria-labelledby="registro">
        <h2 id="registro" className="section-title">Formulario de registro</h2>
        <form onSubmit={handleSubmit}>
          <UsuarioForm
            formData={formData}
            handleChange={handleChange}
            mostrarPassword={true}
            verPassword={verPassword}
            setVerPassword={setVerPassword}
            verRepetir={verRepetir}
            setVerRepetir={setVerRepetir}
            readonlyEmail={false}
            paisesConCiudades={paisesConCiudades}
          >
            {mensaje && (
              <div className={`alert mt-3 ${mensaje.includes("exitoso") ? "alert-success" : "alert-danger"}`} role="alert">
                {mensaje}
              </div>
            )}
            <button type="submit" className="btn btn-outline-dark w-100 mt-2">
              <FaUserPlus className="me-2" /> Registrarse
            </button>
          </UsuarioForm>
        </form>
      </section>
    </main>
  );
};

export default Registro;


