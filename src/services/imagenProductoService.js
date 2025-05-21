import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const getByProducto = (productoId) =>
  axios.get(`${API_BASE_URL}/imagenes-producto/producto/${productoId}`);

const create = (imagen) =>
  axios.post(`${API_BASE_URL}/imagenes-producto`, imagen, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

const deleteImagen = (id) =>
  axios.delete(`${API_BASE_URL}/imagenes-producto/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

const imagenProductoService = {
  getByProducto,
  create,
  delete: deleteImagen,
};

export default imagenProductoService;
