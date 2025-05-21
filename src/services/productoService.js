
import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

// Obtener todos los productos (público o admin)
const getProductos = () => axios.get(`${API_BASE_URL}/productos`);

// Obtener un producto por ID (editar)
const getProductoById = (id) => axios.get(`${API_BASE_URL}/productos/${id}`);

// Crear producto (solo ADMIN, requiere token)
const createProducto = (producto, token) =>
  axios.post(`${API_BASE_URL}/productos`, producto, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Editar producto (solo ADMIN, requiere token)
const updateProducto = (id, producto, token) =>
  axios.put(`${API_BASE_URL}/productos/${id}`, producto, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Eliminar producto (opcional, si luego lo implementas)
const deleteProducto = (id, token) =>
  axios.delete(`${API_BASE_URL}/productos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const productoService = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto, 
};

export default productoService;

