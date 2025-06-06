import { useState } from "react";
import clienteAxios from "../config/clienteAxios";

export default function BuscadorChequeos({ setVista, handleEditarChequeo, resultados, setResultados, buses }) {
  const [sugerencias, setSugerencias] = useState([]);
  const [placa, setPlaca] = useState("");

  const handleChange = (e) => {
  const valor = e.target.value;
  setPlaca(valor);

  const filtradas = buses
    .filter((bus) =>
      bus.placa.toLowerCase().includes(valor.toLowerCase())
    )
    .slice(0, 5); // máximo 5 sugerencias

  setSugerencias(filtradas);
};

const seleccionarPlaca = (placaSeleccionada) => {
  setPlaca(placaSeleccionada);
  setSugerencias([]);
  handleBuscar(placaSeleccionada);
};

 const handleBuscar = async (placaBuscar = placa) => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const res = await clienteAxios.get(`/chequeo/buscar?placa=${placaBuscar}`, config);
    setResultados(res.data);
  } catch (error) {
    console.error("Error al buscar chequeos", error);
    alert("No se pudieron cargar los chequeos.");
  }
};

  return (
    <div className="min-h-screen bg-[#EEEEEE] text-[#222831] p-6 flex flex-col items-center justify-center">
      <div className="bg-[#393E46] p-10 rounded-2xl shadow-xl text-[#EEEEEE] max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-[#00ADB5] mb-6 text-center">Buscar Chequeos de Buses</h2>

        <div className="relative w-full mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Ingrese la placa del bus"
              value={placa}
              onChange={handleChange}
              className="flex-1 p-2 rounded bg-[#222831] text-white"
            />
            <button
              onClick={() => handleBuscar()}
              className="bg-[#00ADB5] text-[#222831] px-4 py-2 rounded font-bold hover:bg-[#00cfd8]"
            >
              Buscar
            </button>
          </div>

          {placa && sugerencias.length > 0 && (
            <ul className="absolute bg-white text-black rounded shadow mt-1 max-h-40 overflow-y-auto w-full z-10">
              {sugerencias.map((bus) => (
                <li
                  key={bus._id}
                  onClick={() => seleccionarPlaca(bus.placa)}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {bus.placa}
                </li>
              ))}
            </ul>
          )}
        </div>

       <div className="space-y-4 max-h-96 overflow-y-auto">
          {resultados.length === 0 ? (
            <p className="text-center text-sm text-gray-400">No hay resultados aún.</p>
          ) : (
            [...resultados]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((r) => (
                <div
                  key={r._id}
                  className="bg-[#222831] text-white p-4 rounded-lg shadow-md flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold">Placa:</span> {r.id_bus?.placa || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Fecha:</span>{" "}
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Mecánico:</span> {r.id_mecanico?.nombre || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Conductor:</span> {r.id_conductor?.nombre || "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditarChequeo(r._id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-md text-sm font-medium"
                  >
                    Corrección
                  </button>
                </div>
              ))
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setResultados([]);   // limpia los resultados
              setVista("inicio");  // vuelve a la pantalla de inicio
            }}
            className="bg-[#00ADB5] text-[#222831] py-2 px-6 rounded-full font-bold text-md hover:bg-[#00cfd8] transition-all"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}