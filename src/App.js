import "./styles/variables.css";
import "./styles/base.css";
import "./styles/utils.css";
import "./styles/login.css";
import AutoRedirect from "./routes/AutoRedirect";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import PerfilPage from "./pages/PerfilPage";
import AuthProvider from "./context/AuthContext";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import UsuarioForm from "./components/UsuarioForm";
import EditarUsuario from "./pages/admin/EditarUsuario";
import RecuperarPassword from "./pages/RecuperarPassword";
import RestablecerPassword from "./pages/RestablecerPassword";
import Dashboard from "./pages/admin/Dashboard";
import AdminCategorias from "./pages/admin/AdminCategorias";
import AdminColecciones from "./pages/admin/AdminColecciones";
import FormularioProducto from "./pages/admin/FormularioProducto";
import AdminProductos from "./pages/admin/AdminProductos";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* RUTAS DE ADMIN CON SUBRUTAS */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="usuarios/crear" element={<UsuarioForm />} />
            <Route path="usuarios/editar/:email" element={<EditarUsuario />} />
            <Route path="categorias" element={<AdminCategorias />} />
            <Route path="colecciones" element={<AdminColecciones />} />
            <Route
              path="productos/crear"
              element={<FormularioProducto modo="crear" />}
            />
            <Route
              path="productos/editar/:id"
              element={<FormularioProducto modo="editar" />}
            />
            <Route path="productos" element={<AdminProductos />} />
          </Route>

          {/* Resto de la web con layout común */}
          <Route
            path="*"
            element={
              <div className="d-flex flex-column min-vh-100">
                <Header />
                <Navbar />
                <AutoRedirect />
                <main className="flex-grow-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/perfil" element={<PerfilPage />} />
                    <Route
                      path="/recuperar-password"
                      element={<RecuperarPassword />}
                    />
                    <Route
                      path="/restablecer-password"
                      element={<RestablecerPassword />}
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
