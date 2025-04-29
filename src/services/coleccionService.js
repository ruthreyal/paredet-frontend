
import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const getColecciones = () => axios.get(`${API_BASE_URL}/colecciones`);
const getColeccionById = (id) => axios.get(`${API_BASE_URL}/colecciones/${id}`);

const coleccionService = { getColecciones, getColeccionById };
export default coleccionService;
