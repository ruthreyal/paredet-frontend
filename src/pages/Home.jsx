import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import productoService from "../services/productoService";
import "../styles/home.css";


const Home = () => {
  const { mensajeLogout, setMensajeLogout } = useContext(AuthContext);
  const [textoActivo, setTextoActivo] = useState(0);
  const [productos, setProductos] = useState([]);
  const [sliderProductos, setSliderProductos] = useState([]);
  const [animando, setAnimando] = useState(false);
  useEffect(() => {
    if (mensajeLogout) {
      const timer = setTimeout(() => setMensajeLogout(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensajeLogout, setMensajeLogout]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setAnimando(true);
      setTimeout(() => {
        setTextoActivo((prev) => (prev + 1) % sliderProductos.length);
        setAnimando(false);
      }, 300);
    }, 3500);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await productoService.getProductos();
        const productos = response.data;

        setSliderProductos(productos.slice(0, 3));
        setProductos(productos.slice(0, 4));
      } catch (error) {
        console.error("Error al cargar productos", error);
      }
    };

    cargarProductos();
  }, []);

  return (
    <div className="home-container">
      {mensajeLogout && (
        <div className="mensaje-expirado" role="alert" aria-live="assertive">
          {mensajeLogout}
        </div>
      )}

      {sliderProductos.length > 0 && (
        <section
          className="hero-slider"
          aria-label="Imagen destacada"
          style={{
            backgroundImage: `url(${sliderProductos[textoActivo].imagenUrl})`,
          }}
          onClick={() => {
            const id = sliderProductos[textoActivo].id;
            window.location.href = `/producto/${id}`;
          }}
        >
          <div className="slider-overlay">
            <h1 className={`slider-text ${animando ? "fade" : ""}`}>
              {["Diseño", "Estilo", "Tendencias"][textoActivo]}
            </h1>
          </div>
        </section>
      )}

      <section className="novedades">
        <h2>Novedades</h2>
        <div className="productos-grid">
          {productos.map((prod) => (
            <div className="producto-card" key={prod.id}>
              <img
                src={prod.imagenUrl}
                alt={`Imagen de ${prod.nombre}`}
                loading="lazy"
              />
              <h3>{prod.nombre}</h3>
              <p>{prod.precio} €</p>
              <Link to={`/producto/${prod.id}`} className="ver-mas">
                Ver más
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
