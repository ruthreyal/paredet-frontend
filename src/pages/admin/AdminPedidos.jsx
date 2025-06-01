import React, { useEffect, useState } from "react";
import pedidoService from "../../services/pedidoService";

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Acceso denegado.");
      return;
    }

    const fetchPedidos = async () => {
      try {
        const data = await pedidoService.getTodosPedidos(token);
        setPedidos(data);
      } catch {
        setError("Error al cargar los pedidos.");
      }
    };

    fetchPedidos();
  }, []);

  return (
    <main className="contenedor-productos">
      <h2 className="section-title">Todos los Pedidos</h2>
      {error && <p role="alert">{error}</p>}
      {pedidos.length === 0 ? (
        <p>No hay pedidos en el sistema.</p>
      ) : (
        <ul aria-label="Lista de pedidos">
          {pedidos.map((pedido) => (
            <li key={pedido.id}>
              <p>
                <strong>Usuario:</strong> {pedido.usuario?.email}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(pedido.fechaCreacion).toLocaleDateString()}
              </p>
              <p>
                <strong>Estado:</strong> {pedido.estado}
              </p>
              <p>
                <strong>Total:</strong> {pedido.total.toFixed(2)} €
              </p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default AdminPedidos;

