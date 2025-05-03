import React, { useState } from "react";
import "../styles/login.css";
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import registroService from "../services/registroService";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

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

  const [verPassword, setVerPassword] = useState(false);
  const [verRepetir, setVerRepetir] = useState(false);

  const { login } = useContext(AuthContext);
  const [mensaje, setMensaje] = useState("");
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
          <div className="mb-3">
            <label htmlFor="nombre">Nombre *</label>
            <input id="nombre" name="nombre" type="text" className="input-field" required value={formData.nombre} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="apellido">Apellido *</label>
            <input id="apellido" name="apellido" type="text" className="input-field" required value={formData.apellido} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" className="input-field" required value={formData.email} onChange={handleChange} />
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="password">Contraseña *</label>
            <input id="password" name="password" type={verPassword ? "text" : "password"} className="input-field" required minLength="6" value={formData.password} onChange={handleChange} />
            <span onClick={() => setVerPassword(!verPassword)} className="position-absolute top-50 end-0 translate-middle-y pe-3" style={{ cursor: "pointer" }}>
              {verPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="repetirPassword">Repetir contraseña *</label>
            <input id="repetirPassword" name="repetirPassword" type={verRepetir ? "text" : "password"} className="input-field" required minLength="6" value={formData.repetirPassword} onChange={handleChange} />
            <span onClick={() => setVerRepetir(!verRepetir)} className="position-absolute top-50 end-0 translate-middle-y pe-3" style={{ cursor: "pointer" }}>
              {verRepetir ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="mb-3">
            <label htmlFor="telefono">Teléfono *</label>
            <input id="telefono" name="telefono" type="tel" className="input-field" required value={formData.telefono} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="direccion">Dirección</label>
            <input id="direccion" name="direccion" type="text" className="input-field" value={formData.direccion} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="pais">País</label>
            <select id="pais" name="pais" className="input-field" value={formData.pais} onChange={handleChange}>
              <option value="">Selecciona un país</option>
              {Object.keys(paisesConCiudades).map((pais) => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
            </select>
          </div>

          {formData.pais && (
            <div className="mb-3">
              <label htmlFor="ciudad">Ciudad</label>
              <select id="ciudad" name="ciudad" className="input-field" value={formData.ciudad} onChange={handleChange}>
                <option value="">Selecciona una ciudad</option>
                {paisesConCiudades[formData.pais].map((ciudad) => (
                  <option key={ciudad} value={ciudad}>{ciudad}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="codigoPostal">Código Postal</label>
            <input id="codigoPostal" name="codigoPostal" type="text" className="input-field" value={formData.codigoPostal} onChange={handleChange} />
          </div>

          <div className="login-message-container mt-3" role="alert">
            {mensaje && (
              <div className={`alert ${mensaje.includes("exitoso") ? "alert-success" : "alert-danger"}`}>
                {mensaje}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-outline-dark w-100 mt-2">
            <FaUserPlus className="me-2" />
            Registrarse
          </button>

        </form>
      </section>
    </main>
  );
};

export default Registro;

