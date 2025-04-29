
import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const login = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data.token;
};

const authService = { login };
export default authService;
