import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Buses = () => {
  const [busqueda, setBusqueda] = useState("");

  const buses = [
    { id: 1, placa: "ABC123", modelo: "Mercedes Benz", capacidad: 45 },
    { id: 2, placa: "XYZ789", modelo: "Volvo", capacidad: 50 },
    { id: 3, placa: "DEF456", modelo: "Scania", capacidad: 40 },
  ];

  const busesFiltrados = buses.filter((bus) =>
    bus.placa.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="text-[#222831] p-4">
      {/* Encabezado con botón */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#00ADB5]">Buses</h1>
        <button className="bg-[#00ADB5] text-white px-4 py-2 rounded-lg hover:bg-[#00bfc8] transition">
          Crear bus
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por placa..."
          className="w-full max-w-md px-4 py-2 rounded-lg border border-[#393E46] bg-white text-[#222831] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition"
        />
      </div>

      {/* Tabla de buses */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-[#393E46] text-white">
            <tr>
              <th className="text-left px-4 py-2">Placa</th>
              <th className="text-left px-4 py-2">Modelo</th>
              <th className="text-left px-4 py-2">Capacidad</th>
              <th className="text-left px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {busesFiltrados.map((bus) => (
              <tr key={bus.id} className="hover:bg-[#EEEEEE] transition">
                <td className="px-4 py-2 border-t border-gray-200">{bus.placa}</td>
                <td className="px-4 py-2 border-t border-gray-200">{bus.modelo}</td>
                <td className="px-4 py-2 border-t border-gray-200">{bus.capacidad}</td>
                <td className="px-4 py-2 border-t border-gray-200 space-x-2">
                  <button
                    className="bg-[#00ADB5] text-white px-3 py-1 rounded hover:bg-[#00bfc8] transition"
                    onClick={() => console.log("Editar", bus.id)}
                  >
                    <FaEdit className="inline mr-1" /> Editar
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    onClick={() => console.log("Eliminar", bus.id)}
                  >
                    <FaTrash className="inline mr-1" /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {busesFiltrados.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No se encontraron buses.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Buses;
