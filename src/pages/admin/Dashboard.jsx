import React, { useEffect, useState } from "react";
import usuarioService from "../../services/usuarioService";
import "../../styles/dashboard.css";
import productoService from "../../services/productoService";
import pedidoService from "../../services/pedidoService";
import coleccionService from "../../services/coleccionService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Dashboard = () => {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [ventasMes, setVentasMes] = useState(0);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [totalColecciones, setTotalColecciones] = useState(0);

  const generarInformePDF = async ({
    totalUsuarios,
    totalProductos,
    totalPedidos,
    totalColecciones,
    ventasMes,
  }) => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString();

    const imageUrl = `${window.location.origin}/img/logo-paredet.png`;

    const getImageBase64 = (url) =>
      new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext("2d").drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        img.src = url;
      });

    const logoBase64 = await getImageBase64(imageUrl);

    const logoWidth = 60;
    const img = new Image();
    img.src = logoBase64;

    await new Promise((resolve) => {
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const logoHeight = logoWidth / aspectRatio;
        const centerX = (doc.internal.pageSize.getWidth() - logoWidth) / 2;
        doc.addImage(logoBase64, "PNG", centerX, 10, logoWidth, logoHeight);
        resolve();
      };
    });

    doc.setFontSize(12);
    doc.setTextColor("#222");
    doc.text(`Fecha: ${fecha}`, 14, 60); 
    autoTable(doc, {
      startY: 70, 
      head: [["Métrica", "Valor"]],
      body: [
        ["Usuarios registrados", totalUsuarios],
        ["Productos publicados", totalProductos],
        ["Pedidos realizados", totalPedidos],
        ["Colecciones", totalColecciones],
        ["Ventas del mes", `${ventasMes.toFixed(2)} €`],
      ],
      headStyles: {
        fillColor: [201, 160, 77], 
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: "#222",
      },
      alternateRowStyles: {
        fillColor: [247, 247, 247],
      },
      styles: {
        font: "helvetica",
        fontSize: 11,
      },
    });

    doc.setFontSize(10);
    doc.setTextColor("#888");
    doc.text(
      "Informe generado automáticamente desde el panel de administración de PAREDET.",
      14,
      doc.internal.pageSize.getHeight() - 10
    );

    doc.save(`informe-dashboard-${fecha.replaceAll("/", "-")}.pdf`);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cargarUsuarios = async () => {
      try {
        const usuarios = await usuarioService.getTodosUsuarios(token);
        setTotalUsuarios(usuarios.length);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };
    cargarUsuarios();

    const cargarProductos = async () => {
      try {
        const response = await productoService.getProductos();
        setTotalProductos(response.data.length);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    cargarProductos();

    const cargarVentasMes = async () => {
      try {
        const token = localStorage.getItem("token");
        const total = await pedidoService.getVentasMesActual(token);
        setVentasMes(total.data);
      } catch (error) {
        console.error("Error al cargar ventas mensuales:", error);
      }
    };

    cargarVentasMes();

    const cargarPedidos = async () => {
      try {
        const token = localStorage.getItem("token");
        const pedidos = await pedidoService.getTodosPedidos(token);
        setTotalPedidos(pedidos.length);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      }
    };

    cargarPedidos();

    const cargarColecciones = async () => {
      try {
        const response = await coleccionService.getColecciones();
        setTotalColecciones(response.data.length);
      } catch (error) {
        console.error("Error al cargar colecciones:", error);
      }
    };

    cargarColecciones();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="section-title">Resumen general</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Usuarios registrados</h3>
          <p className="dashboard-value">{totalUsuarios}</p>
        </div>
        <div className="dashboard-card">
          <h3>Productos publicados</h3>
          <p className="dashboard-value">{totalProductos}</p>
        </div>

        <div className="dashboard-card">
          <h3>Pedidos realizados</h3>
          <p className="dashboard-value">{totalPedidos}</p>
        </div>

        <div className="dashboard-card">
          <h3>Colecciones</h3>
          <p className="dashboard-value">{totalColecciones}</p>
        </div>
      </div>
      <div className="dashboard-ventas">
        <h3>Ventas del mes</h3>
        <p className="dashboard-value">{ventasMes.toFixed(2)} €</p>
      </div>

      <button
        className="btn btn-outline-dark"
        onClick={() =>
          generarInformePDF({
            totalUsuarios,
            totalProductos,
            totalPedidos,
            totalColecciones,
            ventasMes,
          })
        }
        aria-label="Descargar informe en PDF"
      >
        <i className="bi bi-download me-2" aria-hidden="true"></i>
        Descargar informe PDF
      </button>
    </div>
  );
};

export default Dashboard;
