import { createContext, useState, useEffect } from "react";
import usuarioService from "../services/usuarioService";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    console.log("Token en useEffect:", token);

    const cargarUsuario = async () => {
      if (token) {
        try {
          const id = JSON.parse(atob(token.split(".")[1])).sub;
          console.log("ID extraído del token:", id);

          const data = await usuarioService.getUsuarioPorId(id, token); // ✅ Ahora pasamos también el token
          console.log("Datos del usuario recibidos:", data);

          setUsuario(data);
        } catch (error) {
          console.error("Error cargando usuario desde AuthContext", error);
          logout();
        }
      } else {
        console.warn("No hay token disponible.");
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
    <AuthContext.Provider value={{ usuario, token, login, logout, isAuthenticated: !!usuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


