import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import clienteAxios from "../config/clienteAxios";
import ModalUsuario from "../components/ModalUsuario";
import AlcoholTestModal from "../components/AlcoholTestModal";

const Usuarios = () => {
  const [busqueda, setBusqueda] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [roles, setRoles] = useState([]);

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

  const [isEditMode, setIsEditMode] = useState(false);
  const [usuarioIdEditando, setUsuarioIdEditando] = useState(null);

  const [alcoholModalOpen, setAlcoholModalOpen] = useState(false);

  const abrirModalEditar = (usuario) => {
    setIsEditMode(true);
    setUsuarioIdEditando(usuario._id);
    setFormData({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      numero_doc: usuario.numero_doc,
      rol: usuario.rol,
      password: "",
    });
    setModalOpen(true);
    setCrearError(null);
  };

  const abrirModalCrear = () => {
    setIsEditMode(false);
    setUsuarioIdEditando(null);
    setFormData({
      nombre: "",
      apellidos: "",
      numero_doc: "",
      rol: "",
      password: "",
    });
    setModalOpen(true);
    setCrearError(null);
  };

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
      setUsuarios((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      alert("Error eliminando usuario: " + (error.response?.data?.msg || error.message));
    }
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setIsEditMode(false);
    setUsuarioIdEditando(null);
    setFormData({ nombre: "", apellidos: "", numero_doc: "", rol: "", password: "" });
    setCrearError(null);
  };

  const refrescarUsuarios = async () => {
    // refresca la lista usando el último texto de búsqueda
    if (busqueda.trim() === "") {
      setUsuarios([]);
      return;
    }
    setLoading(true);
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

  const handleSubmitCrear = async (e) => {
  // Asegura que preventDefault se llame solo si el evento es válido
  if (e?.preventDefault) e.preventDefault();
  else console.warn("Evento no válido en handleSubmitCrear");

  setCrearLoading(true);
  setCrearError(null);

  try {
    const token = localStorage.getItem("token");

    const rolSeleccionado = roles.find((r) => r._id === formData.rol);
    const requierePassword = rolSeleccionado?.rol === "Mecanico" || rolSeleccionado?.rol === "Admin";

    if (requierePassword && !formData.password?.trim()) {
      setCrearError("La contraseña es obligatoria para este tipo de usuario.");
      return;
    }

    const dataToSubmit = { ...formData };
    if (!requierePassword) delete dataToSubmit.password;

    await clienteAxios.post("/usuarios/crear", dataToSubmit, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Usuario creado con éxito");
    cerrarModal();
    refrescarUsuarios();
  } catch (err) {
    setCrearError(err.response?.data?.msg || "Error al crear el usuario.");
  } finally {
    setCrearLoading(false);
  }
};

const handleSubmitEditar = async (e) => {
  e.preventDefault();
  setCrearLoading(true);
  setCrearError(null);

  try {
    const token = localStorage.getItem("token");

    const datosParaEnviar = { ...formData };
    if (!datosParaEnviar.password?.trim()) {
      delete datosParaEnviar.password;
    }

    await clienteAxios.put(`/usuarios/${usuarioIdEditando}`, datosParaEnviar, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Usuario editado con éxito");
    cerrarModal();
    refrescarUsuarios();
  } catch (err) {
    setCrearError(err.response?.data?.msg || "Error al editar el usuario.");
  } finally {
    setCrearLoading(false);
  }
};

  return (
    <div className="text-[#222831] p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#00ADB5]">Usuarios</h1>
        <div className="flex gap-2">
          <button
            onClick={abrirModalCrear}
            className="bg-[#00ADB5] text-white px-4 py-2 rounded-lg hover:bg-[#00bfc8] transition"
          >
            Crear usuario
          </button>
          <button
            onClick={() => setAlcoholModalOpen(true)}
            className="bg-[#393E46] text-white px-4 py-2 rounded-lg hover:bg-[#4b515a] transition"
          >
            Examen alcoholemia
          </button>
        </div>
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
                  <td className="px-4 py-2 border-t border-gray-200">
                    {roles.find((r) => r._id === usuario.rol)?.rol || "Sin rol"}
                  </td>
                  <td className="px-4 py-2 border-t border-gray-200 space-x-2">
                    <button
                      className="bg-[#00ADB5] text-white px-3 py-1 rounded hover:bg-[#00bfc8] transition"
                      onClick={() => abrirModalEditar(usuario)}
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

      <ModalUsuario
        isOpen={modalOpen}
        onClose={cerrarModal}
        onSubmit={isEditMode ? handleSubmitEditar : handleSubmitCrear}
        formData={formData}
        setFormData={setFormData}
        roles={roles}
        loading={crearLoading}
        error={crearError}
        isEditMode={isEditMode}
      />

      <AlcoholTestModal
        isOpen={alcoholModalOpen}
        onClose={() => setAlcoholModalOpen(false)}
      />
    </div>
  );
};

export default Usuarios;
