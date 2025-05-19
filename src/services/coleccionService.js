import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

// Obtener todas las colecciones (público)
const getColecciones = () => axios.get(`${API_BASE_URL}/colecciones`);

// Obtener una colección por ID (si lo necesitas)
const getColeccionById = (id) =>
  axios.get(`${API_BASE_URL}/colecciones/${id}`);

// Crear colección (solo ADMIN)
const createColeccion = (coleccion, token) =>
  axios.post(`${API_BASE_URL}/colecciones`, coleccion, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Actualizar colección (solo ADMIN)
const updateColeccion = (id, coleccion, token) =>
  axios.put(`${API_BASE_URL}/colecciones/${id}`, coleccion, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Eliminar colección (solo ADMIN)
const deleteColeccion = (id, token) =>
  axios.delete(`${API_BASE_URL}/colecciones/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const coleccionService = {
  getColecciones,
  getColeccionById,
  createColeccion,
  updateColeccion,
  deleteColeccion,
};

export default coleccionService;

