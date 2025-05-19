import React, { useState } from "react";

const SubidaImagen = ({ onUploadSuccess }) => {
  const [imagenPreview, setImagenPreview] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

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
        onUploadSuccess(data.secure_url); // Devuelve la URL al padre
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
    <div className="mb-3">
      <label className="form-label">Imagen destacada:</label>
      <input
        type="file"
        accept="image/*"
        className="form-control"
        onChange={handleFileChange}
        aria-label="Subir imagen destacada"
      />

      {subiendo && <p>Subiendo imagen...</p>}
      {error && <p className="error-text">{error}</p>}
      {imagenPreview && (
        <div className="mt-2">
          <img
            src={imagenPreview}
            alt="Vista previa"
            style={{ maxHeight: "200px", borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  );
};

export default SubidaImagen;
