import React, { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { Link } from "react-router-dom";
import "../styles/carrito.css";

const CarritoPage = () => {
  const {
    carrito,
    eliminarDelCarrito,
    actualizarCantidad,
    calcularTotal,
    finalizarCompra,
    mensajeCompra,
    setMensajeCompra,
  } = useContext(CarritoContext);

  if (carrito.length === 0 && !mensajeCompra) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-4">Tu carrito está vacío</h2>
        <Link to="/" className="btn btn-outline-dark">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Resumen de tu compra</h2>

      {mensajeCompra && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {mensajeCompra}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setMensajeCompra("")}
          ></button>
        </div>
      )}

      {carrito.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table align-middle text-center">
              <thead className="d-none d-md-table-header-group">
                <tr>
                  <th>Producto</th>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="mobile-label">Producto</div>
                      <img
                        src={item.producto?.imagenUrl || "/placeholder.jpg"}
                        alt={item.producto?.nombre}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid #ddd",
                        }}
                      />
                    </td>

                    <td>
                      <strong>{item.producto?.nombre}</strong>
                      <div className="d-flex justify-content-start align-items-center gap-2 mt-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            actualizarCantidad(item.id, item.cantidad - 1)
                          }
                          disabled={item.cantidad === 1}
                        >
                          -
                        </button>
                        <span>{item.cantidad}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            actualizarCantidad(item.id, item.cantidad + 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <div className="detalles-precio mt-2">
                        <div>
                          Precio unitario: {item.producto?.precio?.toFixed(2)} €
                        </div>
                        <div>
                          Subtotal:{" "}
                          {(item.producto?.precio * item.cantidad).toFixed(2)} €
                        </div>
                        <button
                          className="btn btn-sm btn-danger mt-2"
                          onClick={() => eliminarDelCarrito(item.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-end mt-4">
            <h4>
              Total: <strong>{calcularTotal().toFixed(2)} €</strong>
            </h4>
            <button onClick={finalizarCompra} className="btn btn-warning mt-2">
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CarritoPage;
