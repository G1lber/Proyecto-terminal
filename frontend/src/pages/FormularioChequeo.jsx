import React, { useState, useEffect } from "react";
import clienteAxios from "../config/clienteAxios";

export default function FormularioChequeo() {
  const initialFormData = {
    luces: {},
    vidrios: {},
    seguridad: {},
    emergencia: {},
    niveles: {},
    estado_mecanico: {},
    firma_mecanico: "",
    firma_conductor: "",
    id_bus: "",
    id_mecanico: "",
    id_conductor: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [buses, setBuses] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const [busesRes, usuariosRes] = await Promise.all([
          clienteAxios.get("/buses", config),
          clienteAxios.get("/usuarios/listar", config),
        ]);

        setBuses(busesRes.data);
        setUsuarios(usuariosRes.data);
      } catch (error) {
        console.error("Error cargando datos", error);
      }
    };
    fetchData();
  }, []);

  // ✅ Función para normalizar claves como 'Estado Mecánico' => 'estado_mecanico'
  const normalizarClave = (texto) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g, "_");

  const handleChange = (seccion, campo) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [seccion]: {
        ...prev[seccion],
        [campo]: e.target.checked ? "1" : "0",
      },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await clienteAxios.post("/chequeo/crear", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Chequeo guardado correctamente");
      console.log(response.data);
      setFormData(initialFormData);

    } catch (error) {
      console.error("Error al guardar chequeo:", error.response?.data || error.message);
      alert("Hubo un error al guardar el chequeo.");
    }
  };

  const secciones = [
    { titulo: "Luces", campos: ["luces_freno", "direccionales", "reversa", "luz_interna", "bajas", "altas", "farolas", "estacionarias"] },
    { titulo: "Vidrios", campos: ["parabrisas", "laterales", "retrovisores", "vidrio_trasero", "claraboyas"] },
    { titulo: "Seguridad", campos: ["bocina", "cinturones_delanteros", "cinturones_traseros", "alarma_reversa", "manijas_puertas"] },
    { titulo: "Emergencia", campos: ["linterna_pilas", "botiquin", "extintor", "martillos", "herramienta_basica", "conos_reflectores"] },
    { titulo: "Niveles", campos: ["aceite", "refrigerante", "liquido_frenos", "combustible", "aceite_hidraulico"] },
    { titulo: "Estado Mecánico", campos: ["motor_ok", "frenos_ok", "luces_ok", "llantas_ok", "tanque_lleno"] },
  ];

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-[#EEEEEE] text-[#222831] p-6">
      <div className="max-w-4xl mx-auto bg-[#393E46] p-10 rounded-2xl shadow-xl text-[#EEEEEE]">
        <h1 className="text-4xl font-bold mb-10 text-[#00ADB5] text-center">Formulario de Chequeo</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <label className="flex flex-col">
            <span className="text-[#00ADB5] font-medium mb-1">Bus:</span>
            <select name="id_bus" value={formData.id_bus} onChange={handleInputChange} className="bg-[#222831] text-white p-2 rounded">
              <option value="">Selecciona un bus</option>
              {buses.map((bus) => (
                <option key={bus._id} value={bus._id}>{bus.placa}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-[#00ADB5] font-medium mb-1">Mecánico:</span>
            <select name="id_mecanico" value={formData.id_mecanico} onChange={handleInputChange} className="bg-[#222831] text-white p-2 rounded">
              <option value="">Selecciona un mecánico</option>
              {usuarios.filter(u => u.rol?.rol === "Mecanico").map((user) => (
                <option key={user._id} value={user._id}>{user.nombre}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-[#00ADB5] font-medium mb-1">Conductor:</span>
            <select name="id_conductor" value={formData.id_conductor} onChange={handleInputChange} className="bg-[#222831] text-white p-2 rounded">
              <option value="">Selecciona un conductor</option>
              {usuarios.filter(u => u.rol?.rol === "Conductor").map((user) => (
                <option key={user._id} value={user._id}>{user.nombre}</option>
              ))}
            </select>
          </label>
        </div>

        {secciones.map((seccion) => {
          const clave = normalizarClave(seccion.titulo);
          return (
            <fieldset key={seccion.titulo} className="mb-8 border-b border-[#00ADB5] pb-6">
              <legend className="text-2xl text-[#00ADB5] font-semibold mb-4">{seccion.titulo}</legend>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {seccion.campos.map((campo) => (
                  <label key={campo} className="flex items-center gap-2 capitalize">
                    <input
                      type="checkbox"
                      className="accent-[#00ADB5] w-4 h-4"
                      onChange={handleChange(clave, campo)}
                      checked={formData[clave]?.[campo] === "1"}
                    />
                    {campo.replace(/_/g, " ")}
                  </label>
                ))}
              </div>
            </fieldset>
          );
        })}

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <label className="flex flex-col text-[#EEEEEE]">
            <span className="mb-1 text-[#00ADB5] font-medium">Firma del mecánico:</span>
            <input
              type="text"
              name="firma_mecanico"
              value={formData.firma_mecanico}
              onChange={handleInputChange}
              className="p-2 rounded-lg bg-[#222831] border border-[#00ADB5] text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
            />
          </label>

          <label className="flex flex-col text-[#EEEEEE]">
            <span className="mb-1 text-[#00ADB5] font-medium">Firma del conductor:</span>
            <input
              type="text"
              name="firma_conductor"
              value={formData.firma_conductor}
              onChange={handleInputChange}
              className="p-2 rounded-lg bg-[#222831] border border-[#00ADB5] text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
            />
          </label>
        </div>

        <div className="text-center mt-10">
          <button type="submit" className="bg-[#00ADB5] text-[#222831] py-3 px-8 rounded-full font-bold text-lg hover:bg-[#00cfd8] transition-all shadow-md hover:shadow-lg">
            Guardar Chequeo
          </button>
        </div>
      </div>
    </form>
  );
}
