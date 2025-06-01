import React, { useEffect, useState } from "react";
import pedidoService from "../services/pedidoService";
import { jwtDecode } from "jwt-decode";

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Debes iniciar sesión para ver tus pedidos.");
      return;
    }

    const fetchPedidos = async () => {
      try {
        const data = await pedidoService.getMisPedidos(token);
        setPedidos(data);
      } catch (err) {
        setError("Error al cargar tus pedidos.");
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="contenedor-productos">
      <h2>Mis Pedidos</h2>
      {error && <p>{error}</p>}
      {pedidos.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <ul>
          {pedidos.map((pedido) => (
            <li key={pedido.id}>
              <strong>Fecha:</strong>{" "}
              {pedido.fechaCreacion
                ? new Date(pedido.fechaCreacion).toLocaleDateString()
                : "Sin fecha"}
              <br />
              <strong>Estado:</strong> {pedido.estado} <br />
              <strong>Total:</strong>{" "}
              {typeof pedido.total === "number"
                ? pedido.total.toFixed(2)
                : "N/D"}{" "}
              €
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MisPedidos;
