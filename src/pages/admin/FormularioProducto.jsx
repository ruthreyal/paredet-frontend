
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productoService from "../../services/productoService";
import coleccionService from "../../services/coleccionService";
import categoriaService from "../../services/categoriaService";
import SubidaImagen from "../../components/SubidaImagen";
import SubidaGaleria from "../../components/SubidaGaleria";

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
    try {
      if (modo === "crear") {
        await productoService.createProducto(formData, token);
      } else {
        await productoService.updateProducto(id, formData, token);
      }
      setMensaje("Producto guardado correctamente");
      setTimeout(() => navigate("/admin/productos"), 1500);
    } catch (error) {
      console.error("Error al guardar", error);
    }
  };

  return (
    <div className="admin-usuarios-container">
      <h2 className="section-title">
        {modo === "crear" ? "Crear producto" : "Editar producto"}
      </h2>

      {mensaje && <p className="success-text">{mensaje}</p>}

      <form onSubmit={handleSubmit} className="formulario-creacion">
        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="form-control mb-2" required />

        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" rows={3} className="form-control mb-2" />

        <input name="referencia" value={formData.referencia} onChange={handleChange} placeholder="Referencia" className="form-control mb-2" />

        <input name="formato" value={formData.formato} onChange={handleChange} placeholder="Formato" className="form-control mb-2" />

        <input name="tipoAplicacion" value={formData.tipoAplicacion} onChange={handleChange} placeholder="Tipo de aplicación" className="form-control mb-2" />

        <input type="number" name="peso" value={formData.peso} onChange={handleChange} placeholder="Peso (kg)" className="form-control mb-2" />

        <input name="familia" value={formData.familia} onChange={handleChange} placeholder="Familia" className="form-control mb-2" />

        <input type="number" name="precio" value={formData.precio} onChange={handleChange} placeholder="Precio (€)" className="form-control mb-2" />

        <input type="number" name="precioRecomendado" value={formData.precioRecomendado} onChange={handleChange} placeholder="Precio recomendado (€)" className="form-control mb-2" />

        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock disponible" className="form-control mb-2" />

        <label>Categoría:</label>
        <select name="categoriaId" value={formData.categoriaId} onChange={handleChange} className="form-control mb-2">
          <option value="">Seleccione una</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>

        <label>Colección:</label>
        <select name="coleccionId" value={formData.coleccionId} onChange={handleChange} className="form-control mb-2">
          <option value="">Seleccione una</option>
          {colecciones.map((col) => (
            <option key={col.id} value={col.id}>{col.nombre}</option>
          ))}
        </select>

        <SubidaImagen carpeta="productos" onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, imagenUrl: url }))} />

          {modo === "editar" && id && <SubidaGaleria productoId={id} />}

        <button className="btn-gold mt-3" type="submit">
          {modo === "crear" ? "Crear producto" : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
};

export default FormularioProducto;
