// src/components/SubidaGaleria.jsx
import React, { useState, useEffect } from "react";
import imagenProductoService from "../services/imagenProductoService";

const SubidaGaleria = ({ productoId }) => {
  const [imagenes, setImagenes] = useState([]);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    if (productoId) {
      imagenProductoService.getByProducto(productoId).then((res) => {
        setImagenes(res.data);
      });
    }
  }, [productoId]);

  const subirImagen = async (e) => {
    const file = e.target.files[0];
    if (!file || !productoId) return;

    setSubiendo(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "paredet_upload");
    formData.append("folder", "productos");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dim2vr85b/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        await imagenProductoService.create({
          productoId,
          url: data.secure_url,
          destacada: false,
        });
        const actualizadas = await imagenProductoService.getByProducto(productoId);
        setImagenes(actualizadas.data);
      }
    } catch (err) {
      console.error("Error al subir imagen:", err);
    } finally {
      setSubiendo(false);
    }
  };

  const eliminarImagen = async (id) => {
    await imagenProductoService.delete(id);
    const actualizadas = await imagenProductoService.getByProducto(productoId);
    setImagenes(actualizadas.data);
  };

  return (
    <div className="mt-3">
      <label className="form-label">Galería de imágenes adicionales:</label>
      <input type="file" accept="image/*" onChange={subirImagen} className="form-control mb-2" />

      {subiendo && <p>Subiendo imagen...</p>}

      <div className="d-flex flex-wrap gap-3">
        {imagenes.map((img) => (
          <div key={img.id} style={{ position: "relative" }}>
            <img
              src={img.url}
              alt="Imagen"
              style={{ height: "100px", borderRadius: "8px", objectFit: "cover" }}
            />
            <button
              type="button"
              className="btn-eliminar"
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                borderRadius: "50%",
                padding: "0 6px",
                fontSize: "0.8rem",
              }}
              onClick={() => eliminarImagen(img.id)}
              aria-label="Eliminar imagen"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubidaGaleria;
