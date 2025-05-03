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

const getTodosUsuarios = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/usuarios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const crearUsuario = async (usuario, token) => {
  const response = await axios.post(`${API_BASE_URL}/usuarios`, usuario, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const actualizarUsuario = async (email, datos, token) => {
  const response = await axios.put(`${API_BASE_URL}/usuarios/email/${email}`, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const eliminarUsuario = async (email, token) => {
  const response = await axios.delete(`${API_BASE_URL}/usuarios/email/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const usuarioService = {
  getUsuarioPorEmail,
  getTodosUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};

export default usuarioService;





