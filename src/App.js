import './styles/variables.css';
import './styles/base.css';
import './styles/utils.css';
import './styles/login.css'; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import PerfilPage from './pages/PerfilPage';
import AuthProvider from './context/AuthContext';
import AdminLayout from './pages/admin/AdminLayout';
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import UsuarioForm from "./components/UsuarioForm";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* ✅ Rutas de administrador con layout especial */}
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="usuarios/crear" element={<UsuarioForm />} />
          <Route path="usuarios/editar/:email" element={<UsuarioForm />} />
          {/* ✅ Resto de la web con header/navbar/footer */}
          <Route
            path="*"
            element={
              <div className="d-flex flex-column min-vh-100">
                <Header />
                <Navbar />
                <main className="flex-grow-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/perfil" element={<PerfilPage />} />
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







