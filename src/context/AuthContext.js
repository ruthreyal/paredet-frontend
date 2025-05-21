import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usuarioService from "../services/usuarioService";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  // Comprueba si el token ha expirado
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const cargarUsuario = async () => {
      if (token && !isTokenExpired(token)) {
        try {
          const email = JSON.parse(atob(token.split(".")[1])).sub;
          const data = await usuarioService.getUsuarioPorEmail(email, token);
          setUsuario(data);
        } catch (error) {
          logout();
        } finally {
          setCargando(false);
        }
      } else {
        logout();
        setCargando(false);
      }
    };

    cargarUsuario();
  }, [token]);

  const login = (nuevoToken) => {
    localStorage.setItem("token", nuevoToken);
    setToken(nuevoToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        login,
        logout,
        cargando,
        isAuthenticated: !!usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;




