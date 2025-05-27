import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const favoritoService = {
  obtenerPorUsuario: async (usuarioId, token) => {
    const response = await axios.get(`${API_BASE_URL}/favoritos/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  agregar: async (usuarioId, productoId, token) => {
    const response = await axios.post(
      `${API_BASE_URL}/favoritos`,
      { usuarioId, productoId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  eliminar: async (usuarioId, productoId, token) => {
    await axios.delete(`${API_BASE_URL}/favoritos`, {
      params: { usuarioId, productoId },
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default favoritoService;
