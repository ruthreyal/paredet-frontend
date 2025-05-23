import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const login = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data.token;
};

const solicitarRecuperacion = (email) => {
  return axios.post(`${API_BASE_URL}/auth/recuperar`, { email });
};

const restablecerPassword = (token, password) => {
  return axios.post(`${API_BASE_URL}/auth/restablecer`, { token, password });
};

const authService = {
  login,
  solicitarRecuperacion,
  restablecerPassword,
};

export default authService;
