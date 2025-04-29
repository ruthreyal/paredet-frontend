import React from "react";
import "../styles/header.css"; 
import logo from "../assets/icono.png";

const Header = () => {
  return (
    <header className="header-container">
      <img src={logo} alt="Logo de Paredet" className="header-logo" />
      <h1 className="logo-text">PAREDET</h1>
      <p className="slogan">DISEÑO, ESTILO Y TENDENCIAS</p>
    </header>
  );
};

export default Header;



