import React, { useState, useEffect } from "react";
import clienteAxios from "../config/clienteAxios";
import BuscadorChequeos from "../components/BuscadorChequeos";
import ChequeoForm from "../components/ChequeoForm";

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
  const [vista, setVista] = useState("inicio"); // 'inicio' | 'formulario' | 'buscador'
  const [resultados, setResultados] = useState([]);
  const [chequeoEditar, setChequeoEditar] = useState(null);

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

  // Nuevo: función para limpiar estados y volver a inicio
  const handleVolver = () => {
    setChequeoEditar(null);
    setFormData(initialFormData);
    setVista("inicio");
  };

  // Enviar chequeo (crear nuevo)
  const enviarChequeo = async () => {
    try {
      const token = localStorage.getItem("token");
      await clienteAxios.post("/chequeo/crear", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Chequeo guardado correctamente");
      handleVolver();
    } catch (error) {
      console.error("Error al guardar chequeo:", error.response?.data || error.message);
      alert("Hubo un error al guardar el chequeo.");
    }
  };

  // Manejar submit desde formulario, creando un chequeo nuevo siempre
  const handleSubmit = async (datosFormulario) => {
    try {
      const token = localStorage.getItem("token");

      // Si estamos editando, borramos _id para que se cree un chequeo nuevo
      const datosParaGuardar = { ...datosFormulario };
      if (datosParaGuardar._id) {
        delete datosParaGuardar._id;
      }

      await clienteAxios.post("/chequeo/crear", datosParaGuardar, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Chequeo guardado correctamente");
      handleVolver();
    } catch (error) {
      console.error("Error al guardar chequeo:", error.response?.data || error.message);
      alert("Hubo un error al guardar el chequeo.");
    }
  };

  const handleEditarChequeo = (chequeoId) => {
    const chequeo = resultados.find((r) => r._id === chequeoId);
    if (!chequeo) return alert("Chequeo no encontrado.");

    setFormData(chequeo); // Prellenamos el formulario con los datos del chequeo
    setChequeoEditar(chequeo); // Indicamos que estamos en modo editar
    setVista("formulario");
  };

  if (vista === "inicio") {
    return (
      <div className="min-h-screen bg-[#EEEEEE] text-[#222831] flex flex-col items-center justify-center p-6">
        <div className="bg-[#393E46] p-10 rounded-2xl shadow-xl text-[#EEEEEE] max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold text-[#00ADB5] mb-8">Chequeos</h1>
          <button
            onClick={() => {
              setChequeoEditar(null); // Limpia edición al crear nuevo
              setFormData(initialFormData);
              setVista("formulario");
            }}
            className="bg-[#00ADB5] text-[#222831] py-3 px-6 rounded-full font-bold text-lg hover:bg-[#00cfd8] transition-all shadow-md mb-4 w-full"
          >
            Nuevo Chequeo
          </button>
          <button
            onClick={() => setVista("buscador")}
            className="bg-[#EEEEEE] text-[#222831] border border-[#00ADB5] py-3 px-6 rounded-full font-bold text-lg hover:bg-[#dddddd] transition-all w-full"
          >
            Buscar Chequeos
          </button>
        </div>
      </div>
    );
  }

  if (vista === "buscador") {
    return (
      <BuscadorChequeos
        setVista={setVista}
        resultados={resultados}
        setResultados={setResultados}
        handleEditarChequeo={handleEditarChequeo}
        buses={buses}
      />
    );
  }

  if (vista === "formulario") {
    return (
      <ChequeoForm
        initialData={formData}
        onSubmit={handleSubmit}
        onVolver={handleVolver}
        buses={buses}
        usuarios={usuarios}
        modo={chequeoEditar ? "editar" : "crear"}
      />
    );
  }

  return null;
}