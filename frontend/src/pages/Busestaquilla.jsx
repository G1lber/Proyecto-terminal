import { useEffect, useState } from "react";
import clienteAxios from "../config/clienteAxios";

export default function Busestaquilla() {
  const [buses, setBuses] = useState([]);
  const [estados, setEstados] = useState([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerEstados = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await clienteAxios.get("buses/estados", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEstados(res.data);
        if (res.data.length > 0) setEstadoSeleccionado(res.data[0].nombre);
      } catch (err) {
        console.error("Error obteniendo estados", err);
      }
    };
    obtenerEstados();
  }, []);

  useEffect(() => {
    if (!estadoSeleccionado) return;

    const obtenerBuses = async () => {
      try {
        setCargando(true);
        const token = localStorage.getItem("token");
        const { data } = await clienteAxios.get(
          `buses/busesporestado?estado=${estadoSeleccionado}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBuses(data);
      } catch (error) {
        console.error("Error al obtener los buses:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerBuses();
  }, [estadoSeleccionado]);

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#EEEEEE" }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: "#222831" }}>
        Buses en estado:{" "}
        <span style={{ color: "#00ADB5" }}>{estadoSeleccionado}</span>
      </h1>

      <div className="mb-4">
        <label className="mr-2 font-medium" style={{ color: "#393E46" }}>
          Filtrar por estado:
        </label>
        <select
          className="border rounded px-3 py-1"
          style={{
            borderColor: "#00ADB5",
            backgroundColor: "#FFFFFF",
            color: "#222831",
          }}
          value={estadoSeleccionado}
          onChange={(e) => setEstadoSeleccionado(e.target.value)}
        >
          <option value={"0"}>--Seleccione--</option>
          {estados.map((estado) => (
            <option key={estado._id} value={estado.nombre}>
              {estado.estado}
            </option>
          ))}
        </select>
      </div>

      {cargando ? (
        <p className="text-gray-500">Cargando buses...</p>
      ) : buses.length === 0 ? (
        <p className="text-gray-500">No hay buses con este estado.</p>
      ) : (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buses.map((bus) => (
            <div
            key={bus._id}
            className="rounded-xl p-4 shadow-md transition-transform hover:scale-[1.02]"
            style={{
                backgroundColor: "#222831", // Fondo oscuro
                border: "1px solid #00ADB5",
            }}
            >
            <h2
                className="text-xl font-semibold mb-2"
                style={{ color: "#00ADB5" }}
            >
                Placa: {bus.placa}
            </h2>
            <p>
                <span className="font-medium" style={{ color: "#EEEEEE" }}>
                Empresa:
                </span>{" "}
                <span style={{ color: "#EEEEEE" }}>
                {bus.id_empresa?.nombre || "N/A"}
                </span>
            </p>
            <p>
                <span className="font-medium" style={{ color: "#EEEEEE" }}>
                Conductor:
                </span>{" "}
                <span style={{ color: "#EEEEEE" }}>
                {bus.conductor?.nombre || "N/A"}
                </span>
            </p>
            <p>
                <span className="font-medium" style={{ color: "#EEEEEE" }}>
                Copiloto:
                </span>{" "}
                <span style={{ color: "#EEEEEE" }}>
                {bus.copiloto?.nombre || "N/A"}
                </span>
            </p>
            <p>
                <span className="font-medium" style={{ color: "#EEEEEE" }}>
                Dueño:
                </span>{" "}
                <span style={{ color: "#EEEEEE" }}>
                {bus.dueño?.nombre || "N/A"}
                </span>
            </p>
            <p>
                <span className="font-medium" style={{ color: "#EEEEEE" }}>
                SOAT:
                </span>{" "}
                <span style={{ color: "#00ADB5" }}>
                {bus.soat ? "✅" : "❌"}
                </span>
            </p>
            <p>
                <span className="font-medium" style={{ color: "#EEEEEE" }}>
                Tecnomecánica:
                </span>{" "}
                <span style={{ color: "#00ADB5" }}>
                {bus.tecno_mecanica ? "✅" : "❌"}
                </span>
            </p>
            </div>
        ))}
        </div>
      )}
    </div>
  );
}
