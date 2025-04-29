import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const register = async (usuarioData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, usuarioData);
  return response.data.token;
};

const registroService = {
  register,
};

export default registroService;

