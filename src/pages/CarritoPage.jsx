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
    setMensajeCompra
  } = useContext(CarritoContext);

  if (carrito.length === 0 && !mensajeCompra) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-4">Tu carrito está vacío</h2>
        <Link to="/productos" className="btn btn-outline-dark">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Mi Carrito</h2>

      {mensajeCompra && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
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
              <thead>
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
                      <img
                        src={item.producto?.imagenUrl || "/placeholder.jpg"}
                        alt={item.producto?.nombre}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{item.producto?.nombre}</td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                          disabled={item.cantidad === 1}
                        >
                          -
                        </button>
                        <span>{item.cantidad}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{item.producto?.precio?.toFixed(2)} €</td>
                    <td>{(item.producto?.precio * item.cantidad).toFixed(2)} €</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarDelCarrito(item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-end mt-4">
            <h4>Total: <strong>{calcularTotal().toFixed(2)} €</strong></h4>
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

