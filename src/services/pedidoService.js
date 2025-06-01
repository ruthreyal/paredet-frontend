import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/pedidos`;

const getMisPedidos = async (token) => {
  const response = await axios.get(`${API_URL}/mios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getTodosPedidos = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  getMisPedidos,
  getTodosPedidos,
};

