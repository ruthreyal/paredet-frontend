import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const getUsuarioPorEmail = async (email, token) => {
  const response = await axios.get(`${API_BASE_URL}/usuarios/email/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const usuarioService = {
  getUsuarioPorEmail,
};

export default usuarioService;



