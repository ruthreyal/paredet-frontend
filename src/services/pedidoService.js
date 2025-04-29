
import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const getPedidos = (usuarioId) => axios.get(`${API_BASE_URL}/pedidos/usuario/${usuarioId}`);
const createPedido = (pedidoData) => axios.post(`${API_BASE_URL}/pedidos`, pedidoData);

const pedidoService = { getPedidos, createPedido };
export default pedidoService;
