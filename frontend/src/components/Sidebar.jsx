import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const Sidebar = () => {
  const location = useLocation();
  const { auth } = useContext(AuthContext);

  const enlaces = [
    { path: "/usuarios", nombre: "Usuarios", roles: ["Admin"] },
    { path: "/buses", nombre: "Buses", roles: ["Admin"] },
    { path: "/buses-taquilla", nombre: "Buses en taquilla", roles: ["Admin"] },
    { path: "/formulario-chequeo", nombre: "Chequeo", roles: ["Admin","Mecanico"] },
    { path: "/reportes", nombre: "Reportes", roles: ["Admin"] },
  ];

  return (
    <aside className="md:w-64 bg-[#222831] text-[#EEEEEE] min-h-screen">
      <nav className="p-4 space-y-2">
        {enlaces
          .filter((enlace) => enlace.roles.includes(auth.rol)) // 👈 Filtramos por rol
          .map((enlace) => (
            <Link
              key={enlace.path}
              to={enlace.path}
              className={`block px-4 py-2 rounded transition-colors ${
                location.pathname === enlace.path
                  ? "bg-[#00ADB5] text-[#222831] font-semibold"
                  : "hover:bg-[#393E46]"
              }`}
            >
              {enlace.nombre}
            </Link>
          ))}
      </nav>
    </aside>
  );
};

export default Sidebar;