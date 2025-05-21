import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productoService from "../../services/productoService";
import coleccionService from "../../services/coleccionService";
import categoriaService from "../../services/categoriaService";
import SubidaImagen from "../../components/SubidaImagen";
import SubidaGaleria from "../../components/SubidaGaleria";
import "../../styles/formularioProducto.css";
import "../../styles/utils.css";

const FormularioProducto = ({ modo = "crear" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    precioRecomendado: 0,
    stock: 0,
    imagenUrl: "",
    referencia: "",
    formato: "",
    tipoAplicacion: "",
    peso: 0,
    familia: "",
    categoriaId: "",
    coleccionId: "",
  });

  const [colecciones, setColecciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarListas = async () => {
      const [respCol, respCat] = await Promise.all([
        coleccionService.getColecciones(),
        categoriaService.getCategorias(),
      ]);
      setColecciones(respCol.data);
      setCategorias(respCat.data);
    };

    cargarListas();

    if (modo === "editar" && id) {
      productoService.getProductoById(id).then((resp) => {
        setFormData(resp.data);
      });
    }
  }, [modo, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ENVIANDO FORM:", formData); // 👈 Añade esto

    try {
      if (modo === "crear") {
        await productoService.createProducto(formData, token);
      } else {
        await productoService.updateProducto(id, formData, token);
      }

      console.log("GUARDADO OK");
      setMensaje("Producto guardado correctamente");
      setTimeout(() => navigate("/admin/productos"), 1500);
    } catch (error) {
      console.error("Error al guardar", error); // 👈 Verifica si entra aquí
    }
  };

  return (
    <div className="admin-usuarios-container">
      <h2 className="section-title">
        {modo === "crear" ? "Crear producto" : "Editar producto"}
      </h2>

      {mensaje && (
        <p className="success-text" aria-live="polite">
          {mensaje}
        </p>
      )}

      <form onSubmit={handleSubmit} className="formulario-creacion">
        <label htmlFor="nombre">Nombre:</label>
        <input
          id="nombre"
          name="nombre"
          maxLength={50}
          value={formData.nombre}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />

        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          name="descripcion"
          maxLength={250}
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
          className="form-control mb-2"
        />

        <label htmlFor="referencia">Referencia:</label>
        <input
          id="referencia"
          name="referencia"
          maxLength={25}
          value={formData.referencia}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />

        <label htmlFor="formato">Formato:</label>
        <input
          id="formato"
          name="formato"
          maxLength={50}
          value={formData.formato}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <label htmlFor="tipoAplicacion">Tipo de aplicación:</label>
        <input
          id="tipoAplicacion"
          name="tipoAplicacion"
          maxLength={50}
          value={formData.tipoAplicacion}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <label htmlFor="peso">Peso (kg):</label>
        <input
          id="peso"
          type="number"
          name="peso"
          value={formData.peso}
          onChange={handleChange}
          min={0}
          step={0.1}
          required
          className="form-control mb-2"
        />

        <label htmlFor="familia">Familia:</label>
        <input
          id="familia"
          name="familia"
          maxLength={50}
          value={formData.familia}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <label htmlFor="precio">Precio (€):</label>
        <input
          id="precio"
          type="number"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          min={0}
          step="0.01"
          required
          className="form-control mb-2"
        />

        <label htmlFor="precioRecomendado">Precio recomendado (€):</label>
        <input
          id="precioRecomendado"
          type="number"
          name="precioRecomendado"
          value={formData.precioRecomendado}
          onChange={handleChange}
          min={0}
          step="0.01"
          className="form-control mb-2"
        />

        <label htmlFor="stock">Stock disponible:</label>
        <input
          id="stock"
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          min={0}
          required
          className="form-control mb-2"
        />

        <label htmlFor="categoriaId">Categoría:</label>
        <select
          id="categoriaId"
          name="categoriaId"
          value={formData.categoriaId}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value="">Seleccione una</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <label htmlFor="coleccionId">Colección:</label>
        <select
          id="coleccionId"
          name="coleccionId"
          value={formData.coleccionId}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value="">Seleccione una</option>
          {colecciones.map((col) => (
            <option key={col.id} value={col.id}>
              {col.nombre}
            </option>
          ))}
        </select>

        <SubidaImagen
          imagenActual={formData.imagenUrl}
          onUploadSuccess={(url) =>
            setFormData((prev) => ({ ...prev, imagenUrl: url }))
          }
        />

        {modo === "editar" && id && <SubidaGaleria productoId={id} />}
        {modo === "editar" && (
          <div className="fila-botones-form mt-4">
            <button type="submit" className="btn-gold">
              Guardar cambios
            </button>

            <button
              type="button"
              className="btn-eliminar"
              onClick={async () => {
                const confirmar = window.confirm(
                  "¿Estás segura de que deseas eliminar este producto?"
                );
                if (confirmar) {
                  try {
                    await productoService.deleteProducto(id, token);
                    navigate("/admin/productos");
                  } catch (err) {
                    console.error("Error al eliminar producto:", err);
                  }
                }
              }}
            >
              Eliminar producto
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormularioProducto;
