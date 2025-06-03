import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const enlaces = [
    { path: "/usuarios", nombre: "Usuarios" },
    { path: "/buses", nombre: "Buses" },
    { path: "/alcoholemia", nombre: "Examen Alcoholemia" },
    { path: "/buses-taquilla", nombre: "Buses en taquilla" },
  ];

  return (
    <aside className="md:w-64 bg-[#222831] text-[#EEEEEE] min-h-screen">
      
      <nav className="p-4 space-y-2">
        {enlaces.map((enlace) => (
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