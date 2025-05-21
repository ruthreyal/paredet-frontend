import React, { useState, useEffect } from "react";
import imagenProductoService from "../services/imagenProductoService";
import "../styles/formularioProducto.css";

const SubidaGaleria = ({ productoId }) => {
  const [imagenes, setImagenes] = useState([]);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    if (productoId) {
      cargarImagenes();
    }
  }, [productoId]);

  const cargarImagenes = async () => {
    const res = await imagenProductoService.getByProducto(productoId);
    setImagenes(res.data);
  };

  const subirImagen = async (e) => {
    const file = e.target.files[0];
    if (!file || !productoId) return;

    setSubiendo(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "paredet_upload");
    formData.append("folder", "productos");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dim2vr85b/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        await imagenProductoService.create({
          productoId,
          url: data.secure_url,
          destacada: false,
        });
        cargarImagenes();
      }
    } catch (err) {
      console.error("Error al subir imagen:", err);
    } finally {
      setSubiendo(false);
    }
  };

  const eliminarImagen = async (id) => {
    const confirmar = window.confirm(
      "¿Estás segura de que quieres eliminar esta imagen?"
    );
    if (!confirmar) return;
    await imagenProductoService.delete(id);
    cargarImagenes();
  };

  return (
    <div className="mt-3">
      <label className="form-label">Galería de imágenes adicionales:</label>
      <input
        type="file"
        accept="image/*"
        onChange={subirImagen}
        className="form-control mb-2"
        aria-label="Subir imagen adicional"
      />

      {subiendo && <p>Subiendo imagen...</p>}

      <div className="galeria-grid">
        {imagenes.map((img) => (
          <div key={img.id} className="galeria-item">
            <img src={img.url} alt="Imagen galería" />
            <p
              className="texto-eliminar"
              onClick={() => eliminarImagen(img.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && eliminarImagen(img.id)}
            >
              Eliminar
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubidaGaleria;
