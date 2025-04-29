
import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const getCategorias = () => axios.get(`${API_BASE_URL}/categorias`);
const getCategoriaById = (id) => axios.get(`${API_BASE_URL}/categorias/${id}`);

const categoriaService = { getCategorias, getCategoriaById };
export default categoriaService;
