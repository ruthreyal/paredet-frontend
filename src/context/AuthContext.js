import { createContext, useState, useEffect } from "react";
import usuarioService from "../services/usuarioService";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [cargando, setCargando] = useState(true); // NUEVO

  useEffect(() => {
    const cargarUsuario = async () => {
      if (token) {
        try {
          const email = JSON.parse(atob(token.split(".")[1])).sub;
          console.log("Email extraído del token:", email);

          const data = await usuarioService.getUsuarioPorEmail(email, token);
          console.log("Datos del usuario recibidos:", data);

          setUsuario(data);
        } catch (error) {
          console.error("Error cargando usuario desde AuthContext", error);
          logout();
        } finally {
          setCargando(false);
        }
      } else {
        console.warn("No hay token disponible.");
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
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        login,
        logout,
        cargando, // NUEVO
        isAuthenticated: !!usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;



