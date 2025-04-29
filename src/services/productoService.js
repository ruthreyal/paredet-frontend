
import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const getProductos = () => axios.get(`${API_BASE_URL}/productos`);
const getProductoById = (id) => axios.get(`${API_BASE_URL}/productos/${id}`);

const productoService = { getProductos, getProductoById };
export default productoService;
