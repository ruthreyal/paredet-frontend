import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import usuarioService from "../services/usuarioService";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [mensajeLogout, setMensajeLogout] = useState("");

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
          localStorage.removeItem("token");
          setToken(null);
          setUsuario(null);
          navigate("/");
        } finally {
          setCargando(false);
        }
      } else {
        const rutasPermitidasSinToken = [
          "/",
          "/login",
          "/registro",
          "/restablecer-password",
          "/recuperar-password",
        ];

        const rutaActual = location.pathname;
        const accesoPermitido = rutasPermitidasSinToken.some((ruta) =>
          rutaActual.startsWith(ruta)
        );

        if (!accesoPermitido) {
          localStorage.removeItem("token");
          setToken(null);
          setUsuario(null);
          navigate("/");
        } else {
          setToken(null);
          setUsuario(null);
        }

        setCargando(false);
      }
    };

    cargarUsuario();
  }, [token, location, navigate]);

  const login = (nuevoToken) => {
    localStorage.setItem("token", nuevoToken);
    setToken(nuevoToken);
  };

  useEffect(() => {
    let timeout;

    if (token && !isTokenExpired(token)) {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      const tiempoRestante = exp * 1000 - Date.now();

      timeout = setTimeout(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUsuario(null);
        setMensajeLogout(
          "Tu sesión ha caducado. Por favor, vuelve a iniciar sesión."
        );
        navigate("/");
      }, tiempoRestante);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [token, navigate]);

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
        mensajeLogout,
        setMensajeLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
