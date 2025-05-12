import React from "react";
import "../styles/header.css"; 
import logo from "../assets/icono.png";
import { Link } from "react-router-dom";


const Header = () => {
  return (
    <header className="header-container">
      <Link to="/" className="text-decoration-none d-flex flex-column align-items-center">
        <img src={logo} alt="Logo de Paredet" className="header-logo" />
        <h1 className="logo-header">PAREDET</h1>
      </Link>
      <p className="slogan">DISEÑO, ESTILO Y TENDENCIAS</p>
    </header>

  );
};

export default Header;



