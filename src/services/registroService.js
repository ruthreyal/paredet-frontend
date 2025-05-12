import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

// Registro sin token (registro público)
const registerPublic = async (usuarioData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, usuarioData, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data.token;
};

// Registro desde panel admin (requiere token)
const registerConToken = async (usuarioData, token) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, usuarioData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.token;
};

const registroService = {
  registerPublic,
  registerConToken
};

export default registroService;


