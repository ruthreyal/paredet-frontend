import React, { useContext, useEffect } from "react";
import "../styles/home.css";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { mensajeLogout, setMensajeLogout } = useContext(AuthContext);

  useEffect(() => {
    if (mensajeLogout) {
      const timer = setTimeout(() => setMensajeLogout(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensajeLogout, setMensajeLogout]);

  return (
    <div className="home-container">
      {mensajeLogout && (
        <div
          className="mensaje-expirado"
          role="alert"
          aria-live="assertive"
        >
          {mensajeLogout}
        </div>
      )}

      <h1 className="home-title">Bienvenido a Paredet</h1>
      <p className="home-slogan">
        Diseño, estilo y tendencias para transformar tus espacios.
      </p>
    </div>
  );
};

export default Home;




