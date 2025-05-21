import React, { useState, useEffect } from "react";
import "../styles/formularioProducto.css";

const SubidaImagen = ({ onUploadSuccess, imagenActual }) => {
  const [imagenPreview, setImagenPreview] = useState(imagenActual || null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (imagenActual) {
      setImagenPreview(imagenActual);
    }
  }, [imagenActual]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendo(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "paredet_upload");
    formData.append("folder", "colecciones");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dim2vr85b/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setImagenPreview(data.secure_url);
        onUploadSuccess(data.secure_url);
      } else {
        setError("No se pudo subir la imagen");
      }
    } catch (err) {
      console.error("Error al subir imagen:", err);
      setError("Error al subir imagen");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="contenedor-subida">
      {imagenPreview && (
        <div className="imagen-destacada-container">
          <p className="form-label">Imagen destacada:</p>
          <img src={imagenPreview} alt="Imagen destacada" />
        </div>
      )}
      <div className="subida-input">
        {!imagenPreview && <p className="form-label">Imagen destacada:</p>}
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleFileChange}
          aria-label="Cambiar imagen destacada"
        />
      </div>
    </div>
  );
};

export default SubidaImagen;
