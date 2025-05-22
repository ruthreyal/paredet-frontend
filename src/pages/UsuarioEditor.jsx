import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaUserPlus, FaTrash } from "react-icons/fa";
import UsuarioForm from "../components/UsuarioForm";
import FormularioContraseñaNueva from "../components/FormularioContraseñaNueva";
import paisesConCiudades from "../data/paisesConCiudades";
import "../styles/formularios.css";

const UsuarioEditor = ({
  modo = "crear", // "crear" o "editar"
  esPerfil = false, // true si es desde PerfilPage
  usuario,
  setUsuario,
  onSubmit,
  mensaje,
  setMensaje,
  onDelete,
}) => {
  const navigate = useNavigate();

  const [verPassword, setVerPassword] = useState(false);
  const [verRepetir, setVerRepetir] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 4000);
  };

  const handleDeleteClick = () => {
    if (window.confirm("¿Estás segura de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      onDelete();
    }
  };

  return (
    <main className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh", paddingTop: "3rem", paddingBottom: "3rem" }}>

      <section className="form-box d-flex flex-column justify-content-between"
        style={{ maxWidth: "500px", width: "100%" }}>

        <h2 className="section-title">
          {modo === "crear" ? "Formulario de registro" : "Mi perfil"}
        </h2>

        <form onSubmit={onSubmit} aria-label={modo === "crear" ? "Formulario de registro de usuario" : "Formulario de actualización de perfil"}>
          <UsuarioForm
            formData={usuario}
            handleChange={handleChange}
            readonlyEmail={modo === "editar"}
            paisesConCiudades={paisesConCiudades}
            isAdmin={false}
          />

          {modo === "crear" && (
            <FormularioContraseñaNueva
              password={usuario.password || ""}
              repetirPassword={usuario.repetirPassword || ""}
              verPassword={verPassword}
              setVerPassword={setVerPassword}
              verRepetir={verRepetir}
              setVerRepetir={setVerRepetir}
              handleChange={handleChange}
            />
          )}

          {mensaje && (
            <div className="alerta-clara mt-3" role="alert" aria-live="polite">
              {mensaje}
            </div>
          )}

          <button type="submit" className="btn btn-outline-dark w-100 mt-2">
            {modo === "crear" ? (
              <><FaUserPlus className="me-2" /> Registrarse</>
            ) : (
              <><FaSave className="me-2" /> Guardar cambios</>
            )}
          </button>
        </form>

        {esPerfil && modo === "editar" && (
          <>
            <hr className="my-4" />
            <button
              type="button"
              className="btn-claro-inverso"
              onClick={handleDeleteClick}
              aria-label="Eliminar cuenta"
            >
              <FaTrash className="me-2" /> Eliminar cuenta
            </button>
          </>
        )}
      </section>
    </main>
  );
};

export default UsuarioEditor;