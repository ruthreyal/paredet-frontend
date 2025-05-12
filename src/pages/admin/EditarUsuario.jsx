import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usuarioService from "../../services/usuarioService";
import UsuarioForm from "../../components/UsuarioForm";
import FormularioContraseñaNueva from "../../components/FormularioContraseñaNueva";

const EditarUsuario = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [verRepetir, setVerRepetir] = useState(false);
  const [loading, setLoading] = useState(true);

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
          rol: data.rol || { nombre: "USER" },
          password: "",
          repetirPassword: ""
        });
      } catch (error) {
        setMensaje("Error al cargar usuario.");
        setTimeout(() => setMensaje(""), 3000);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [email, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      rol: formData.rol ? { nombre: formData.rol.nombre || "USER" } : null
    };

    try {
      await usuarioService.actualizarUsuario(email, payload, token);
      setMensaje("Usuario actualizado correctamente.");
      setTimeout(() => {
        setMensaje("");
        navigate("/admin/usuarios");
      }, 2000);
    } catch (error) {
      setMensaje("Error al actualizar usuario.");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando formulario...</p>;
  if (!formData) return <p className="text-center mt-4 text-danger">No se pudo cargar el formulario</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Editar Usuario</h2>

      {mensaje && <div className="alert-elegante mb-3">{mensaje}</div>}

      <form onSubmit={handleSubmit}>
        <UsuarioForm
          formData={formData}
          handleChange={handleChange}
          readonlyEmail={true}
          paisesConCiudades={null}
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
        <div className="text-end mt-4">
          <button type="submit" className="btn btn-dark">
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarUsuario;









