import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const links = [
    { path: "/", label: "Logout" },
  ];

  return (
    <header className="bg-[#222831] text-[#EEEEEE] px-6 py-4 shadow-md">
      <nav className="flex justify-between items-center ">
        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-3">
          <img src="../../lgterminal.png" alt="logo" className="w-12 h-12" />
          <span className="text-2xl font-bold text-[#00ADB5]">Terminal</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-sm">
          {links.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`transition-colors duration-200 hover:text-[#00ADB5] ${
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