import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const carritoService = {
  agregarProducto: async (productoId, cantidad, token) => {
    const response = await axios.post(
      `${API_BASE_URL}/carrito/add`,
      { productoId, cantidad },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  obtenerPorUsuario: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/carrito/usuario`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  eliminarDelCarrito: async (carritoItemId, token) => {
    const response = await axios.delete(
      `${API_BASE_URL}/carrito/${carritoItemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
  actualizarCantidad: async (carritoItemId, cantidad, token) => {
  const response = await axios.put(
    `${API_BASE_URL}/carrito/${carritoItemId}`,
    { cantidad },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
},

};

export default carritoService;
