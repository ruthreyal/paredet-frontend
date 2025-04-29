
import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const getCarrito = (usuarioId) => axios.get(`${API_BASE_URL}/carrito/usuario/${usuarioId}`);
const addToCarrito = (carritoData) => axios.post(`${API_BASE_URL}/carrito`, carritoData);
const removeFromCarrito = (carritoItemId) => axios.delete(`${API_BASE_URL}/carrito/${carritoItemId}`);

const carritoService = { getCarrito, addToCarrito, removeFromCarrito };
export default carritoService;
