import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const links = [
    { path: "/perfil", label: "Perfil" },
    { path: "/login", label: "Logout" },
  ];

  return (
    <header className="bg-[#222831] text-[#EEEEEE] px-6 py-4 shadow-md">
      <nav className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#00ADB5]">
          Terminal
        </Link>
        <div className="space-x-6 text-sm">
          {links.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`transition-colors hover:text-[#00ADB5] ${
                location.pathname === path ? "text-[#00ADB5] font-semibold" : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
