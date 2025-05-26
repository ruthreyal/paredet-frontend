
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AutoRedirect = () => {
  const { usuario, cargando } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (cargando) return;

    const path = location.pathname;

    if (usuario?.rolNombre === "ADMIN" && path === "/login") {
      navigate("/admin", { replace: true });
    }
  }, [usuario, cargando, location, navigate]);

  return null;
};

export default AutoRedirect;
