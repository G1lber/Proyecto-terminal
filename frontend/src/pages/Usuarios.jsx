import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import clienteAxios from "../config/clienteAxios"; // ajusta la ruta

const Usuarios = () => {

  const [busqueda, setBusqueda] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [roles, setRoles] = useState([]);

  // Estados para modal Crear Usuario
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    numero_doc: "",
    rol: "",
    password: "",
  });
  const [crearError, setCrearError] = useState(null);
  const [crearLoading, setCrearLoading] = useState(false);
  

  //Buscar usuario
  useEffect(() => {
    if (busqueda.trim() === "") {
      setUsuarios([]);
      return;
    }

    const fetchUsuarios = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await clienteAxios.get(`/usuarios/buscar`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { q: busqueda },
        });
        setUsuarios(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [busqueda]);
  //Roles modal
  useEffect(() => {
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await clienteAxios.get("/rol/listar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data);
    } catch (error) {
      console.error("Error cargando roles:", error);
    }
  };

  fetchRoles();
}, []);
const eliminarUsuario = async (id) => {
  if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

  try {
    const token = localStorage.getItem("token");
    await clienteAxios.delete(`/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Usuario eliminado con éxito");

    // Actualizar la lista de usuarios localmente, filtrando el eliminado:
    setUsuarios((prevUsuarios) => prevUsuarios.filter((u) => u._id !== id));
  } catch (error) {
    alert("Error eliminando usuario: " + (error.response?.data?.msg || error.message));
  }
};

// Modal handlers
  const abrirModal = () => setModalOpen(true);
  const cerrarModal = () => {
    setModalOpen(false);
    setFormData({ nombre: "", apellidos: "", numero_doc: "", rol: "", password: "" });
    setCrearError(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmitCrear = async (e) => {
    e.preventDefault();
    setCrearLoading(true);
    setCrearError(null);
    try {
      const token = localStorage.getItem("token");
      await clienteAxios.post("/usuarios/crear", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Usuario creado con éxito");
      cerrarModal();
      setBusqueda(""); // limpiar búsqueda
      setUsuarios([]); // limpiar usuarios para que refresque al buscar
    } catch (err) {
      setCrearError(err.response?.data?.msg || err.message);
    } finally {
      setCrearLoading(false);
    }
  };
const mostrarPassword = () => {
  // Cambia 'rol.rol' por el campo correcto según tu data
  const rolSeleccionado = roles.find(r => r._id === formData.rol);
  if (!rolSeleccionado) return false;

  // Ajusta los nombres según tus roles reales
  return rolSeleccionado.rol === "Mecanico" || rolSeleccionado.rol === "Admin";
};

  return (
    <div className="text-[#222831] p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#00ADB5]">Usuarios</h1>
        <button
          onClick={abrirModal}
          className="bg-[#00ADB5] text-white px-4 py-2 rounded-lg hover:bg-[#00bfc8] transition"
        >
          Crear usuario
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar usuario..."
          className="w-full max-w-md px-4 py-2 rounded-lg border border-[#393E46] bg-white text-[#222831] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition"
        />
      </div>

      {loading && <p className="mb-4 text-[#00ADB5]">Cargando usuarios...</p>}
      {error && <p className="mb-4 text-red-600">Error: {error}</p>}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-[#393E46] text-white">
            <tr>
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">Documento</th>
              <th className="text-left px-4 py-2">Rol</th>
              <th className="text-left px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario._id} className="hover:bg-[#EEEEEE] transition">
                  <td className="px-4 py-2 border-t border-gray-200">{usuario.nombre}</td>
                  <td className="px-4 py-2 border-t border-gray-200">{usuario.numero_doc}</td>
                  <td className="px-4 py-2 border-t border-gray-200">{roles.find(r => r._id === usuario.rol)?.rol || "Sin rol"}</td>
                  <td className="px-4 py-2 border-t border-gray-200 space-x-2">
                    <button
                      className="bg-[#00ADB5] text-white px-3 py-1 rounded hover:bg-[#00bfc8] transition"
                      onClick={() => console.log("Editar", usuario._id)}
                    >
                      <FaEdit className="inline mr-1" /> Editar
                    </button>
                    <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    onClick={() => eliminarUsuario(usuario._id)}
                    >
                    <FaTrash className="inline mr-1" /> Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Crear Usuario */}
      {modalOpen && (
            <div
                className="fixed inset-0 flex items-center justify-center z-50"
                onClick={cerrarModal}  // clic en fondo cierra modal
            >
                <div
                className="bg-[#EEEEEE] rounded-lg p-6 max-w-md w-full shadow-lg"
                onClick={(e) => e.stopPropagation()} // evita que el clic cierre el modal si se da dentro
                >
                 {/* Contenedor para título y botón */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-[#00ADB5]">Crear usuario</h2>
                        <button
                        onClick={cerrarModal}
                        className="text-[#393E46] hover:text-[#00ADB5] font-bold text-2xl leading-none"
                        aria-label="Cerrar modal"
                        >
                        ×
                        </button>
                    </div>

                <form onSubmit={handleSubmitCrear} className="space-y-4">
                    
                    <input
                    name="nombre"
                    type="text"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded text-[#222831] bg-white placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
                    />
                    <input
                    name="apellidos"
                    type="text"
                    placeholder="Apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded text-[#222831] bg-white placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
                    />
                    <input
                    name="numero_doc"
                    type="text"
                    placeholder="Número de documento"
                    value={formData.numero_doc}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded text-[#222831] bg-white placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
                    />
                    <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded text-[#222831] bg-white placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
                    >
                    <option value="" disabled>
                        Selecciona un rol
                    </option>
                    {roles.map((rol) => (
                        <option key={rol._id} value={rol._id}>
                        {rol.rol}
                        </option>
                    ))}
                    </select>
                    {mostrarPassword() && (
                        <input
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded text-[#222831] bg-white placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
                        />
                    )}
                    {crearError && (
                    <p className="text-red-600 text-sm">{crearError}</p>
                    )}

                    <div className="flex justify-end space-x-2 mt-4">
                    <button
                        type="button"
                        onClick={cerrarModal}
                        className="px-4 py-2 rounded text-[#393E46] hover:bg-[#393E46] hover:text-[#EEEEEE] transition"
                        disabled={crearLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={crearLoading}
                        className="bg-[#00ADB5] text-white px-4 py-2 rounded hover:bg-[#00bfc8] transition"
                    >
                        {crearLoading ? "Guardando..." : "Guardar"}
                    </button>
                    </div>
                </form>
                </div>
            </div>
        )}

    </div>
  );
};

export default Usuarios;
