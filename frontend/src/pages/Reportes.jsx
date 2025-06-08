import { useEffect, useState } from "react";
import clienteAxios from "../config/clienteAxios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reportes() {
  const [placa, setPlaca] = useState("");
  const [resultados, setResultados] = useState([]);
  const [chequeo, setChequeo] = useState(null);
  const [buses, setBuses] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);

  useEffect(() => {
    const cargarBuses = async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await clienteAxios.get("/buses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBuses(data);
      } catch (error) {
        console.error("Error al cargar buses", error);
      }
    };

    cargarBuses();
  }, []);

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
  };

  const buscarChequeos = async () => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await clienteAxios.get(`/chequeo/buscar-reportes?placa=${placa}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResultados(data);
      setChequeo(null);
    } catch (error) {
      console.error("Error buscando chequeos", error);
      alert("No se pudieron cargar los chequeos.");
    }
  };

  const seleccionarChequeo = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await clienteAxios.get(`/chequeo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChequeo(data);
    } catch (error) {
      console.error("Error al obtener chequeo:", error);
    }
  };

  const generarPDF = () => {
  const doc = new jsPDF();

  const datosPrincipales = [
    ["Placa del Bus", chequeo?.id_bus?.placa || "N/A"],
    ["Mecánico", `${chequeo?.id_mecanico?.nombre || ""} ${chequeo?.id_mecanico?.apellidos || ""}`],
    ["Conductor", `${chequeo?.id_conductor?.nombre || ""} ${chequeo?.id_conductor?.apellidos || ""}`],
    ["Fecha", new Date(chequeo?.createdAt).toLocaleString()],
  ];

  // Encabezado visual
  doc.setFontSize(16);
  doc.setTextColor(41, 128, 185); // Azul moderno
  doc.text("Reporte de Chequeo Vehicular", 105, 20, null, null, "center");

  // Tabla de datos principales
  autoTable(doc, {
    startY: 30,
    body: datosPrincipales,
    theme: 'striped',
    styles: {
      fontSize: 10,
      halign: 'left',
      cellPadding: 3,
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [41, 128, 185] },
    },
    margin: { top: 10 },
  });

  // Para formatear el estado en texto legible
  const formatearEstado = (obj) => {
    if (!obj) return [["Sin datos"]];
    return Object.entries(obj).map(([clave, valor]) => [
      clave.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()), // Capitaliza
      valor ? "Bien" : "Mal"
    ]);
  };

  // Definir categorías
  const categorias = [
    { nombre: "Luces", datos: chequeo?.luces },
    { nombre: "Vidrios", datos: chequeo?.vidrios },
    { nombre: "Seguridad", datos: chequeo?.seguridad },
    { nombre: "Emergencia", datos: chequeo?.emergencia },
    { nombre: "Niveles", datos: chequeo?.niveles },
    { nombre: "Estado Mecánico", datos: chequeo?.estado_mecanico },
  ];

  let y = doc.lastAutoTable.finalY + 10;

  // Generar tablas por categoría
  categorias.forEach(cat => {
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text(cat.nombre, 14, y);
    autoTable(doc, {
      startY: y + 2,
      head: [["Revisión", "Estado"]],
      body: formatearEstado(cat.datos),
      styles: {
        fontSize: 9,
        halign: 'left',
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 50 },
      },
      margin: { left: 14, right: 14 },
    });
    y = doc.lastAutoTable.finalY + 8;
  });

  // Guardar el archivo
  doc.save(`chequeo_${chequeo?.id_bus?.placa || "reporte"}.pdf`);
};

  return (
    <div className="min-h-[600px] bg-[#EEEEEE] p-6 text-[#222831]">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-10">
        <h2 className="text-2xl font-bold text-[#00ADB5] mb-4">Generar Reportes</h2>

        {/* Buscador con sugerencias */}
        <div className="relative w-full mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Ingrese la placa del bus"
              value={placa}
              onChange={handleChange}
              className="flex-1 p-2 rounded bg-[#EEEEEE] text-[#222831]"
            />
            <button
              onClick={buscarChequeos}
              className="bg-[#00ADB5] text-white px-4 py-2 rounded hover:bg-[#00cfd8] transition"
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

        {/* Resultados */}
        {resultados.length > 0 && (
          <div className="space-y-4 mb-8 max-h-60 overflow-y-auto">
            {resultados.map((r) => (
              <div
                key={r._id}
                className="bg-[#222831] text-white p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="text-sm"><strong>Fecha:</strong> {new Date(r.createdAt).toLocaleString()}</p>
                  <p className="text-sm"><strong>Conductor:</strong> {r.id_conductor?.nombre || "N/A"}</p>
                </div>
                <button
                  onClick={() => seleccionarChequeo(r._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded text-sm"
                >
                  Ver Reporte
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Detalles del chequeo */}
        {chequeo && (
          <>
            <h3 className="text-xl font-semibold text-[#00ADB5] mb-2">Detalle del Chequeo</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div><strong>Placa:</strong> {chequeo.id_bus?.placa}</div>
              <div><strong>Fecha:</strong> {new Date(chequeo.createdAt).toLocaleString()}</div>
              <div><strong>Mecánico:</strong> {chequeo.id_mecanico?.nombre}</div>
              <div><strong>Conductor:</strong> {chequeo.id_conductor?.nombre}</div>
            </div>

            <div className="mb-4">
                <h4 className="font-semibold mb-2">Chequeo Detallado:</h4>
                {["luces", "vidrios", "seguridad", "emergencia", "niveles", "estado_mecanico"].map((seccion) => {
                    const datos = chequeo[seccion];
                    return (
                    <div key={seccion} className="mb-2">
                        <strong>{seccion.toUpperCase()}:</strong>
                        {datos && typeof datos === "object" ? (
                        <ul className="list-disc list-inside bg-gray-100 p-2 rounded text-sm max-h-48 overflow-auto">
                            {Object.entries(datos).map(([key, value]) => (
                            <li key={key}>
                                <span className="capitalize">{key.replace(/_/g, " ")}:</span> {value ? "Bien" : "Mal"}
                            </li>
                            ))}
                        </ul>
                        ) : (
                        <p className="bg-gray-100 p-2 rounded text-sm">{datos ? "Bien" : "Mal"}</p>
                        )}
                    </div>
                    );
                })}
            </div>

            <button
              onClick={generarPDF}
              className="bg-[#00ADB5] text-white px-4 py-2 rounded hover:bg-[#00cfd8] transition"
            >
              Descargar PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}
