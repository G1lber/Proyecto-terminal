import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ModalBuses from "../components/ModalBuses";
import clienteAxios from "../config/clienteAxios";

const Buses = () => {
  const [busqueda, setBusqueda] = useState("");
  const [buses, setBuses] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState({
    placa: "",
    num_identificacion_empresa: "",
    id_empresa: "",
    estado: "",
    conductor: "",
    copiloto: "",
    dueño: "",
    soat: false,
    tecno_mecanica: false,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [busEditandoId, setBusEditandoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [estados, setEstados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  

  useEffect(() => {
    obtenerBuses();
    obtenerUsuarios();
    obtenerEstados();
    obtenerEmpresas();
  }, []);

  const obtenerEmpresas = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await clienteAxios.get("buses/listar-empresa", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEmpresas(res.data);
  } catch (err) {
    console.error("Error obteniendo empresas", err);
  }
};

  const obtenerBuses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await clienteAxios.get("buses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses(res.data);
    } catch (err) {
      console.error("Error obteniendo buses", err);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await clienteAxios.get("usuarios/listar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error obteniendo usuarios", err);
    }
  };

  const obtenerEstados = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await clienteAxios.get("buses/estados", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEstados(res.data);
    } catch (err) {
      console.error("Error obteniendo estados", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCrearBus = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!formData.placa) {
        setError("La placa del bus es obligatoria.");
        setLoading(false);
        return;
      }

      await clienteAxios.post("/buses/crear", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Bus creado con éxito");
      cerrarModal();
      obtenerBuses();
    } catch (err) {
      setError(err.response?.data?.msg || "Error al crear el bus.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEditarBus = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const datosParaEnviar = { ...formData };
      if (!datosParaEnviar.copiloto) delete datosParaEnviar.copiloto;
      if (!datosParaEnviar.dueño) delete datosParaEnviar.dueño;

      await clienteAxios.put(`/buses/${busEditandoId}`, datosParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Bus editado con éxito");
      cerrarModal();
      obtenerBuses();
    } catch (err) {
      setError(err.response?.data?.msg || "Error al editar el bus.");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalCrear = () => {
    setFormData({
      placa: "",
      num_identificacion_empresa: "",
      estado: "",
      conductor: "",
      copiloto: "",
      dueño: "",
      soat: false,
      tecno_mecanica: false,
    });
    setIsEditMode(false);
    setModalAbierto(true);
  };

  const abrirModalEditar = (bus) => {
  setFormData({
    placa: bus.placa,
    num_identificacion_empresa: bus.num_identificacion_empresa,
    id_empresa: bus.id_empresa?._id || "", 
    estado: bus.estado?._id || "", 
    conductor: bus.conductor?._id || "", 
    copiloto: bus.copiloto?._id || "",   
    dueño: bus.dueño?._id || "",        
    soat: bus.soat || false,
    tecno_mecanica: bus.tecno_mecanica || false,
  });
  setBusEditandoId(bus._id);
  setIsEditMode(true);
  setModalAbierto(true);
};

  const cerrarModal = () => {
    setModalAbierto(false);
    setError("");
    setFormData({
      placa: "",
      num_identificacion_empresa: "",
      estado: "",
      conductor: "",
      copiloto: "",
      dueño: "",
      soat: false,
      tecno_mecanica: false,
    });
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este bus?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      await clienteAxios.delete(`/buses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      obtenerBuses();
    } catch (err) {
      console.error("Error al eliminar el bus:", err.response?.data || err.message);
      alert("Ocurrió un error al intentar eliminar el bus.");
    }
  };

  const busesFiltrados = buses.filter((bus) =>
    bus.placa.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="text-[#222831] p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#00ADB5]">Buses</h1>
        <button
          onClick={abrirModalCrear}
          className="bg-[#00ADB5] text-white px-4 py-2 rounded-lg hover:bg-[#00bfc8] transition"
        >
          Crear bus
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por placa..."
          className="w-full max-w-md px-4 py-2 rounded-lg border border-[#393E46] bg-white text-[#222831] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-[#393E46] text-white">
            <tr>
              <th className="text-left px-4 py-2">Placa</th>
              <th className="text-left px-4 py-2">Ident. Empresa</th>
              <th className="text-left px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {busesFiltrados.map((bus) => (
              <tr key={bus._id} className="hover:bg-[#EEEEEE] transition">
                <td className="px-4 py-2 border-t border-gray-200">{bus.placa}</td>
                <td className="px-4 py-2 border-t border-gray-200">{bus.num_identificacion_empresa}</td>
                <td className="px-4 py-2 border-t border-gray-200 space-x-2">
                  <button
                    className="bg-[#00ADB5] text-white px-3 py-1 rounded hover:bg-[#00bfc8] transition"
                    onClick={() => abrirModalEditar(bus)}
                  >
                    <FaEdit className="inline mr-1" /> Editar
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    onClick={() => handleEliminar(bus._id)}
                  >
                    <FaTrash className="inline mr-1" /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {busesFiltrados.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No se encontraron buses.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <ModalBuses
          isEditMode={isEditMode}
          formData={formData}
          onChange={handleChange}
          onSubmit={isEditMode ? handleSubmitEditarBus : handleSubmitCrearBus}
          onClose={cerrarModal}
          loading={loading}
          error={error}
          estados={estados}
          usuarios={usuarios}
          empresas={empresas}

        />
      )}
    </div>
  );
};

export default Buses;