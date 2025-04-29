import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

/**
 * Obtiene un usuario por su ID, enviando el token JWT en la cabecera Authorization.
 */
const getUsuarioPorId = async (id, token) => {
  const response = await axios.get(`${API_BASE_URL}/usuarios/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const usuarioService = {
  getUsuarioPorId,
};

export default usuarioService;


