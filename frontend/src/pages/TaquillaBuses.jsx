import { useEffect, useState } from "react";
import clienteAxios from "../config/clienteAxios";

export default function TaquillaBuses() {
  const [buses, setBuses] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerBusesDisponibles = async () => {
      try {
        setCargando(true);
        const token = localStorage.getItem("token");
        const { data } = await clienteAxios.get("buses/disponibles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBuses(data);
      } catch (error) {
        console.error("Error al obtener los buses disponibles:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerBusesDisponibles();
  }, []);

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#EEEEEE" }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: "#222831" }}>
        Buses disponibles
      </h1>

      {cargando ? (
        <p className="text-gray-500">Cargando buses disponibles...</p>
      ) : buses.length === 0 ? (
        <p className="text-gray-500">No hay buses disponibles en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buses.map((bus) => (
            <div
              key={bus._id}
              className="rounded-xl p-4 shadow-md transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: "#222831",
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