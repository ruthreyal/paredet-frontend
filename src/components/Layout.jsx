import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AutoRedirect from "../routes/AutoRedirect";

const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Navbar />
      <AutoRedirect />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
