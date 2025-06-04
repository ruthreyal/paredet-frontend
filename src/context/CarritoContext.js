import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import carritoService from "../services/carritoService";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../services/apiConfig";

export const CarritoContext = createContext();

const CarritoProvider = ({ children }) => {
  const { usuario, token } = useContext(AuthContext);
  const [carrito, setCarrito] = useState([]);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [mensajeCompra, setMensajeCompra] = useState("");

  const cargarCarrito = async () => {
    if (!usuario || !token || usuario.rol === "ADMIN") return;

    try {
      const items = await carritoService.obtenerPorUsuario(token);
      items.sort((a, b) => a.producto.nombre.localeCompare(b.producto.nombre));
      setCarrito(items);
      const total = items.reduce((acc, item) => acc + item.cantidad, 0);
      setTotalCarrito(total);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
    }
  };

  const calcularTotal = () => {
    return carrito.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    );
  };

  useEffect(() => {
    cargarCarrito();
  }, [usuario?.id, token]);

  const eliminarDelCarrito = async (carritoItemId) => {
    try {
      await carritoService.eliminarDelCarrito(carritoItemId, token);
      await cargarCarrito();
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
    }
  };

  const actualizarCantidad = async (carritoItemId, nuevaCantidad) => {
    try {
      await carritoService.actualizarCantidad(
        carritoItemId,
        nuevaCantidad,
        token
      );
      await cargarCarrito();
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    }
  };

  const finalizarCompra = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/pedidos/realizar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return true;
    } catch (error) {
      console.error("Error al finalizar compra:", error);
      return false;
    }
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    setTotalCarrito(0);
  };

  const value = useMemo(
    () => ({
      carrito,
      totalCarrito,
      cargarCarrito,
      calcularTotal,
      eliminarDelCarrito,
      actualizarCantidad,
      finalizarCompra,
      mensajeCompra,
      setMensajeCompra,
      vaciarCarrito,
    }),
    [carrito, totalCarrito, mensajeCompra]
  );

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  );
};

export default CarritoProvider;
