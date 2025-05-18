import React from "react";

const AdminHamburger = ({ menuOpen, toggleMenu }) => {
  return (
    <button
      onClick={toggleMenu}
      className={`admin-menu-toggle ${menuOpen ? "open" : ""}`}
      aria-label="Abrir o cerrar menú de administración"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};

export default AdminHamburger;



