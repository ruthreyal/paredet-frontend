
import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const getDirecciones = (usuarioId) => axios.get(`${API_BASE_URL}/direcciones/usuario/${usuarioId}`);
const addDireccion = (direccionData) => axios.post(`${API_BASE_URL}/direcciones`, direccionData);
const deleteDireccion = (direccionId) => axios.delete(`${API_BASE_URL}/direcciones/${direccionId}`);

const direccionService = { getDirecciones, addDireccion, deleteDireccion };
export default direccionService;
