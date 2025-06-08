import React, { useContext, useState } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { Link } from "react-router-dom";
import "../styles/carrito.css";
import AlertaToast from "../components/AlertaToast";

const CarritoPage = () => {
  const {
    carrito,
    eliminarDelCarrito,
    actualizarCantidad,
    calcularTotal,
    finalizarCompra,
    mensajeCompra,
    vaciarCarrito,
  } = useContext(CarritoContext);

  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "info",
  });

  const mostrarToast = (mensaje, tipo = "info") => {
    setToast({ mostrar: true, mensaje, tipo });
    setTimeout(() => {
      setToast({ ...toast, mostrar: false });
    }, 4000);
  };

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
      <AlertaToast
        mostrar={toast.mostrar}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
        titulo="Notificación"
        mensaje={toast.mensaje}
        tipo={toast.tipo}
      />

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
                    {/* Imagen */}
                    <td>
                      <div className="mobile-label">Producto</div>
                      <img
                        src={item.producto?.imagenUrl || "/placeholder.jpg"}
                        alt={item.producto?.nombre}
                        className="img-fluid"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid #ddd",
                        }}
                      />
                    </td>

                    {/* Nombre + cantidad + precio + eliminar */}
                    <td className="text-start d-md-flex flex-column justify-content-center align-items-start gap-2">
                      <strong>{item.producto?.nombre}</strong>

                      {/* Controles cantidad */}
                      <div className="d-flex align-items-center gap-2">
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

                      {/* Detalles precios */}
                      <div className="detalles-precio">
                        <div>
                          Precio unitario: {item.producto?.precio?.toFixed(2)} €
                        </div>
                        <div>
                          Subtotal:{" "}
                          {(item.producto?.precio * item.cantidad).toFixed(2)} €
                        </div>
                      </div>

                      {/* Eliminar */}
                      <button
                        className="btn btn-outline-dark mt-2"
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
            <h4>
              Total: <strong>{calcularTotal().toFixed(2)} €</strong>
            </h4>
            <button
              className="btn btn-outline-dark w-40"
              onClick={async () => {
                const ok = await finalizarCompra();
                if (ok) {
                  vaciarCarrito();
                  mostrarToast("¡Compra realizada con éxito!", "elegante");
                }
              }}
            >
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CarritoPage;
