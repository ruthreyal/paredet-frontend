import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import categoriaService from "../../services/categoriaService";
import FormularioCategoria from "../../components/FormularioCategoria";
import "../../styles/adminUsuarios.css";

const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await categoriaService.getCategorias();
      setCategorias(response.data);
    } catch (error) {
      setMensaje("Error al cargar categorías");
    }
  };

  const categoriasFiltradas = categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="admin-usuarios-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="section-title">Gestión de Categorías</h2>
        <button
          className="btn-acceso"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          aria-label="Crear nueva categoría"
        >
          {mostrarFormulario ? "Cancelar" : "+ Crear categoría"}
        </button>
      </div>

      {mostrarFormulario && (
        <FormularioCategoria onCategoriaCreada={cargarCategorias} />
      )}

      <input
        type="text"
        placeholder="Buscar por nombre"
        className="input-field mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        aria-label="Buscar categoría"
      />

      {categoriasFiltradas.length === 0 ? (
        <p>No hay categorías registradas.</p>
      ) : (
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.map((categoria) => (
              <tr
                key={categoria.id}
                onClick={() =>
                  navigate(`/admin/categorias/editar/${categoria.id}`)
                }
                style={{ cursor: "pointer" }}
                aria-label={`Editar categoría ${categoria.nombre}`}
              >
                <td>{categoria.id}</td>
                <td>{categoria.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {mensaje && <p className="mt-3">{mensaje}</p>}
    </div>
  );
};

export default AdminCategorias;

