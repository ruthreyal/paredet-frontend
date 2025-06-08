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
    if (sliderProductos.length === 0) return;

    const intervalo = setInterval(() => {
      setAnimando(true);
      setTimeout(() => {
        setTextoActivo((prev) => (prev + 1) % sliderProductos.length);
        setAnimando(false);
      }, 300);
    }, 3500);

    return () => clearInterval(intervalo);
  }, [sliderProductos.length]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await productoService.getProductos();
        const productos = response.data;

        const productosOrdenados = [...productos].sort(
          (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
        );

        setSliderProductos(productosOrdenados.slice(0, 3));
        setTextoActivo(0);
        setProductos(productosOrdenados.slice(0, 4));
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

      {sliderProductos.length > 0 && sliderProductos[textoActivo] && (
        <section
          className="hero-slider"
          aria-label="Imagen destacada"
          style={{
            backgroundImage: `url(${sliderProductos[textoActivo]?.imagenUrl})`,
          }}
          onClick={() => {
            const id = sliderProductos[textoActivo]?.id;
            if (id) window.location.href = `/producto/${id}`;
          }}
        >
          <div className="slider-overlay">
            <h1 className={`slider-text ${animando ? "fade" : ""}`}>
              {["Diseño", "Estilo", "Tendencias"][textoActivo]}
            </h1>
          </div>
        </section>
      )}
      <section className="info">
        <p>
          Con los papeles pintados decorativos, las paredes se convierten en
          garantes de comodidad. En nuestra tienda online encontrará todo lo que
          necesita para decorarlas a su gusto. Papel pintado de lujo, ofrecemos una amplia gama para
          pedir en línea. No importa si se decide por un papel pintado tnt o un
          fotomural - con nosotros comprará todo lo que busca para dar un toque
          individual a las paredes. Convierta su hogar en un lugar con un
          ambiente especial y utilice los papeles pintados de alta calidad. Encontrará colecciónes y catálogos más
          diversos.
          Deje que su creatividad fluya libremente en su salón, oficina o
          habitación de los niños y realice sus ideas para empapelar.
        </p>
      </section>

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
