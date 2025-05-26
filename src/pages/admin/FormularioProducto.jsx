import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productoService from "../../services/productoService";
import coleccionService from "../../services/coleccionService";
import categoriaService from "../../services/categoriaService";
import SubidaImagen from "../../components/SubidaImagen";
import SubidaGaleria from "../../components/SubidaGaleria";
import { FaExclamationCircle } from "react-icons/fa";
import "../../styles/formularioProducto.css";
import "../../styles/utils.css";

const FormularioProducto = ({ modo = "crear" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [originalNombre, setOriginalNombre] = useState("");
  const [originalReferencia, setOriginalReferencia] = useState("");

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
  const [errors, setErrors] = useState({});

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
        setOriginalNombre(resp.data.nombre);
        setOriginalReferencia(resp.data.referencia);
      });
    }
  }, [modo, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarFormulario = async () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else if (formData.nombre.length > 255) {
      nuevosErrores.nombre = "El nombre no puede superar los 255 caracteres.";
    } else if (modo === "crear" || formData.nombre !== originalNombre) {
      const existe = await productoService.nombreExiste(formData.nombre);
      if (existe.data) {
        nuevosErrores.nombre = "Ya existe un producto con este nombre.";
      }
    }

    if (!formData.referencia.trim()) {
      nuevosErrores.referencia = "La referencia es obligatoria.";
    } else if (formData.referencia.length > 100) {
      nuevosErrores.referencia =
        "La referencia no puede superar los 100 caracteres.";
    } else if (modo === "crear" || formData.referencia !== originalReferencia) {
      const existeRef = await productoService.referenciaExiste(
        formData.referencia
      );
      if (existeRef.data) {
        nuevosErrores.referencia = "Ya existe un producto con esta referencia.";
      }
    }

    if (!formData.categoriaId) {
      nuevosErrores.categoriaId = "La categoría es obligatoria.";
    }

    if (!formData.coleccionId) {
      nuevosErrores.coleccionId = "La colección es obligatoria.";
    }

    if (formData.precio <= 0) {
      nuevosErrores.precio = "El precio debe ser mayor que 0.";
    }

    if (formData.stock < 0) {
      nuevosErrores.stock = "El stock no puede ser negativo.";
    }

    if (formData.peso < 0) {
      nuevosErrores.peso = "El peso no puede ser negativo.";
    }

    if (formData.descripcion.length > 1000) {
      nuevosErrores.descripcion =
        "La descripción no puede superar los 1000 caracteres.";
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = await validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    const productoParaEnviar = {
      ...formData,
      categoriaId: formData.categoriaId || null,
      coleccionId: formData.coleccionId || null,
    };

    try {
      if (modo === "crear") {
        await productoService.createProducto(productoParaEnviar, token);
      } else {
        await productoService.updateProducto(id, productoParaEnviar, token);
      }

      setMensaje("Producto guardado correctamente");
      setTimeout(() => navigate("/admin/productos"), 1500);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.mensaje) {
        setErrors({ general: error.response.data.mensaje });
      } else {
        setErrors({ general: "Error inesperado. Intenta más tarde." });
      }
      console.error("Error al guardar", error);
    }
  };

  const handleEliminar = async () => {
    const confirmar = window.confirm(
      "¿Estás segura de que deseas eliminar este producto?"
    );
    if (!confirmar) return;

    try {
      await productoService.deleteProducto(id, token);
      navigate("/admin/productos");
    } catch (error) {
      console.error("Error al eliminar producto", error);
      setErrors({
        general: "No se pudo eliminar el producto. Intenta más tarde.",
      });
    }
  };

  const renderError = (campo) =>
    errors[campo] && (
      <div className="form-error" role="alert">
        <FaExclamationCircle className="icono-error" /> {errors[campo]}
      </div>
    );

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

      {errors.general && (
        <div className="form-error mb-2" role="alert">
          <FaExclamationCircle className="icono-error" /> {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="formulario-creacion" noValidate>
        <label htmlFor="nombre">Nombre *</label>
        <input
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="input-field"
          required
          aria-required="true"
        />
        {renderError("nombre")}

        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="input-field"
          rows={3}
        />
        {renderError("descripcion")}

        <label htmlFor="referencia">Referencia *</label>
        <input
          id="referencia"
          name="referencia"
          value={formData.referencia}
          onChange={handleChange}
          className="input-field"
          required
          aria-required="true"
        />
        {renderError("referencia")}

        <label htmlFor="formato">Formato</label>
        <input
          id="formato"
          name="formato"
          value={formData.formato}
          onChange={handleChange}
          className="input-field"
        />

        <label htmlFor="tipoAplicacion">Tipo de aplicación</label>
        <input
          id="tipoAplicacion"
          name="tipoAplicacion"
          value={formData.tipoAplicacion}
          onChange={handleChange}
          className="input-field"
        />

        <label htmlFor="peso">Peso (kg)</label>
        <input
          id="peso"
          name="peso"
          type="number"
          step="0.1"
          min="0"
          value={formData.peso}
          onChange={handleChange}
          className="input-field"
        />
        {renderError("peso")}

        <label htmlFor="familia">Familia</label>
        <input
          id="familia"
          name="familia"
          value={formData.familia}
          onChange={handleChange}
          className="input-field"
        />

        <label htmlFor="precio">Precio (€) *</label>
        <input
          id="precio"
          name="precio"
          type="number"
          step="0.01"
          min="0"
          value={formData.precio}
          onChange={handleChange}
          required
          className="input-field"
          aria-required="true"
        />
        {renderError("precio")}

        <label htmlFor="precioRecomendado">Precio recomendado (€)</label>
        <input
          id="precioRecomendado"
          name="precioRecomendado"
          type="number"
          step="0.01"
          min="0"
          value={formData.precioRecomendado}
          onChange={handleChange}
          className="input-field"
        />

        <label htmlFor="stock">Stock disponible *</label>
        <input
          id="stock"
          name="stock"
          type="number"
          min="0"
          value={formData.stock}
          onChange={handleChange}
          required
          className="input-field"
          aria-required="true"
        />
        {renderError("stock")}

        <label htmlFor="categoriaId">
          Categoría{" "}
          <span aria-hidden="true" style={{ color: "red" }}>
            *
          </span>
        </label>
        <select
          id="categoriaId"
          name="categoriaId"
          value={formData.categoriaId || ""}
          onChange={handleChange}
          className="input-field"
          aria-required="true"
          required
        >
          <option value="">Seleccione una</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {renderError("categoriaId")}

        <label htmlFor="coleccionId">
          Colección{" "}
          <span aria-hidden="true" style={{ color: "red" }}>
            *
          </span>
        </label>
        <select
          id="coleccionId"
          name="coleccionId"
          value={formData.coleccionId || ""}
          onChange={handleChange}
          className="input-field"
          aria-required="true"
          required
        >
          <option value="">Seleccione una</option>
          {colecciones.map((col) => (
            <option key={col.id} value={col.id}>
              {col.nombre}
            </option>
          ))}
        </select>
        {renderError("coleccionId")}

        <SubidaImagen
          imagenActual={formData.imagenUrl}
          onUploadSuccess={(url) =>
            setFormData((prev) => ({ ...prev, imagenUrl: url }))
          }
        />

        {modo === "editar" && id && <SubidaGaleria productoId={id} />}

        <div className="fila-botones-form mt-4">
          <button type="submit" className="btn btn-outline-dark w-40 mt-2">
            {modo === "crear" ? "Crear producto" : "Guardar cambios"}
          </button>

          {modo === "editar" && (
            <button type="button" className="btn-gold" onClick={handleEliminar}>
              Eliminar producto
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormularioProducto;
