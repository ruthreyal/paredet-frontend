import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import AlertaToast from "./AlertaToast";
import "../styles/footer.css";

const Footer = () => {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [redSocial, setRedSocial] = useState("");

  const handleClick = (nombreRed) => {
    setRedSocial(nombreRed);
    setMostrarAlerta(true);
  };

  return (
    <footer className="footer">
      <div className="footer-info">
        <p><strong>Paredet</strong></p>
        <p>Empresa ficticia creada como parte de un proyecto educativo.</p>
        <p>Ubicación: Calle Imaginaria 123, Madrid, España</p>
        <p>Email: paredet.tiendaonline@gmail.com | Teléfono: +34 912 345 678</p>
      </div>
      <div className="footer-social">
        <p>Síguenos en redes sociales:</p>
        <div className="social-icons">
          <FaFacebookF onClick={() => handleClick("Facebook")} />
          <FaInstagram onClick={() => handleClick("Instagram")} />
          <FaTwitter onClick={() => handleClick("Twitter")} />
        </div>
      </div>
      <small>&copy; {new Date().getFullYear()} Paredet. Todos los derechos reservados.</small>

      {/* Alerta de redes sociales */}
      <AlertaToast
        mostrar={mostrarAlerta}
        onCerrar={() => setMostrarAlerta(false)}
        tipo="info"
        mensaje={`La página de ${redSocial} está en construcción`}
      />
    </footer>
  );
};

export default Footer;


