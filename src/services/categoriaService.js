import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

// Obtener todas las categorías (público)
const getCategorias = () => axios.get(`${API_BASE_URL}/categorias`);

// Obtener una categoría por ID (público)
const getCategoriaById = (id) =>
  axios.get(`${API_BASE_URL}/categorias/${id}`);

// Crear categoría (requiere token de admin)
const createCategoria = (categoria, token) =>
  axios.post(`${API_BASE_URL}/categorias`, categoria, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Actualizar categoría por ID (requiere token de admin)
const updateCategoria = (id, categoria, token) =>
  axios.put(`${API_BASE_URL}/categorias/${id}`, categoria, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Eliminar categoría (requiere token de admin)
const deleteCategoria = (id, token) =>
  axios.delete(`${API_BASE_URL}/categorias/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const categoriaService = {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};

export default categoriaService;


