import React from "react";
import "../styles/empresa.css";

const Empresa = () => {
  return (
    <main className="empresa-container">
      <section className="empresa-info">
        <h1>Sobre Paredet</h1>
        <p>
          En <strong>Paredet</strong>, con sede en Sevilla, nos especializamos en la venta online
          de papel pintado y fotomurales de alta calidad. Ofrecemos una experiencia de compra visual,
          moderna y sencilla, pensada para transformar cualquier espacio en un entorno lleno de estilo.
        </p>
        <p>
          Nuestro catálogo incluye colecciones exclusivas seleccionadas cuidadosamente para adaptarse
          a todo tipo de gustos y tendencias decorativas. Además, trabajamos constantemente en
          ampliar nuestra oferta para inspirarte con nuevas ideas.
        </p>
      </section>

      <section className="empresa-contacto">
        <h2>Datos de contacto</h2>
        <ul>
          <li><strong>Dirección:</strong> Calle del Diseño, 123 – 41001 Sevilla, España</li>
          <li><strong>Teléfono:</strong> 955 123 456</li>
          <li><strong>Email:</strong> <a href="mailto:paredet.tiendaonline@gmail.com">paredet.tiendaonline@gmail.com</a></li>
          <li><strong>Horario de atención:</strong> Lunes a Viernes de 9:00 a 18:00</li>
        </ul>
      </section>
    </main>
  );
};

export default Empresa;

