import React, { useState, useEffect } from "react";
import clienteAxios from "../config/clienteAxios"; // Asegúrate de ajustar el import según tu estructura

export default function AlcoholTestModal({ isOpen, onClose }) {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    id_conductor: "",
    resultado: "",
    fecha_hora: "",
    observaciones: "",
    archivo: null,
  });

  useEffect(() => {
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

    if (isOpen) obtenerUsuarios();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "archivo" ? files[0] : value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    await clienteAxios.post("usuarios/examenalcohol", {
      id_conductor: formData.id_conductor,
      resultado: formData.resultado,
      fecha_hora: formData.fecha_hora,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    alert("Examen subido correctamente");
    handleClose();
  } catch (err) {
    console.error(err);
    alert("Error al subir el examen");
  }
};

  const handleClose = () => {
    onClose();
    setFormData({
      id_conductor: "",
      resultado: "",
      fecha_hora: "",
      observaciones: "",
      archivo: null,
    });
  };

  if (!isOpen) return null;

  return (
    <div
  className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-60"
  onClick={handleClose}
>
  <div
    className="bg-[#EEEEEE] rounded-lg p-6 max-w-xl w-full shadow-lg"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-[#00ADB5]">
        Registrar Examen de Alcoholemia
      </h2>
      <button
        onClick={handleClose}
        className="text-[#393E46] hover:text-[#00ADB5] font-bold text-2xl"
      >
        ×
      </button>
    </div>

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[#393E46] mb-1">Nombre del conductor</label>
        <select
          name="id_conductor"
          value={formData.id_conductor}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 rounded bg-white text-[#222831] border border-[#00ADB5] placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
        >
          <option value="">Seleccionar conductor</option>
          {usuarios.map((usuario) => (
            <option key={usuario._id} value={usuario._id}>
              {usuario.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[#393E46] mb-1">Fecha y hora del examen</label>
        <input
          type="datetime-local"
          name="fecha_hora"
          value={formData.fecha_hora}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 rounded bg-white text-[#222831] border border-[#00ADB5] placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
        />
      </div>

      <div>
        <label className="block text-[#393E46] mb-1">Resultado (mg/L)</label>
        <input
          type="number"
          step="0.01"
          name="resultado"
          value={formData.resultado}
          onChange={handleChange}
          required
          placeholder="Ej: 0.35"
          className="w-full px-3 py-2 rounded bg-white text-[#222831] border border-[#00ADB5] placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
        />
      </div>

      <div>
        <label className="block text-[#393E46] mb-1">Observaciones</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          rows={3}
          placeholder="Detalles relevantes del examen"
          className="w-full px-3 py-2 rounded bg-white text-[#222831] border border-[#00ADB5] placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
        />
      </div>

      <div>
        <label className="block text-[#393E46] mb-1">Subir archivo</label>
        <input
          type="file"
          name="archivo"
          accept=".pdf,.jpg,.png"
          onChange={handleChange}
          className="text-[#393E46]"
        />
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 rounded text-[#393E46] hover:bg-[#393E46] hover:text-[#EEEEEE] transition border border-[#393E46]"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-[#00ADB5] hover:bg-[#00bfc8] text-white px-5 py-2 rounded font-semibold transition"
        >
          Subir Examen
        </button>
      </div>
    </form>
  </div>
</div>
  );
}