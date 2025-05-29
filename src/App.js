import "./styles/variables.css";
import "./styles/base.css";
import "./styles/utils.css";
import "./styles/login.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import { PrivateRouteAdmin } from "./routes/PrivateRouteAdmin";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import PerfilPage from "./pages/PerfilPage";
import RecuperarPassword from "./pages/RecuperarPassword";
import RestablecerPassword from "./pages/RestablecerPassword";
import Producto from "./pages/Productos";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import UsuarioForm from "./components/UsuarioForm";
import EditarUsuario from "./pages/admin/EditarUsuario";
import AdminCategorias from "./pages/admin/AdminCategorias";
import AdminColecciones from "./pages/admin/AdminColecciones";
import FormularioProducto from "./pages/admin/FormularioProducto";
import AdminProductos from "./pages/admin/AdminProductos";
import ColeccionPage from "./pages/ColeccionPage";
import Favoritos from "./pages/Favoritos";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* RUTAS DE ADMIN PROTEGIDAS */}
          <Route path="/admin" element={<PrivateRouteAdmin />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="usuarios/crear" element={<UsuarioForm />} />
              <Route path="usuarios/editar/:email" element={<EditarUsuario />} />
              <Route path="categorias" element={<AdminCategorias />} />
              <Route path="colecciones" element={<AdminColecciones />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="productos/crear" element={<FormularioProducto modo="crear" />} />
              <Route path="productos/editar/:id" element={<FormularioProducto modo="editar" />} />
            </Route>
          </Route>

          {/* RUTAS GENERALES */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />
            <Route path="perfil" element={<PerfilPage />} />
            <Route path="/productos" element={<Producto />} />
            <Route path="/colecciones/:nombre" element={<ColeccionPage />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="recuperar-password" element={<RecuperarPassword />} />
            <Route path="restablecer-password" element={<RestablecerPassword />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;


