import React, { useEffect, useState } from "react";
import clienteAxios from "../config/clienteAxios"; // Asegúrate que esta ruta sea correcta

export default function AlcoholTestForm() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    id_conductor: "",
    resultado: "",
    fecha_hora: "",
    observaciones: "",
    archivo: null
  });

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

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "archivo") {
      setFormData({ ...formData, archivo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const token = localStorage.getItem("token");
      await clienteAxios.post("examenes/crear", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Examen subido correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al subir el examen");
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[#393E46] p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-[#00ADB5] mb-6">
          Registrar Examen de Alcoholemia
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* SELECT CONDUCTOR */}
          <div>
            <label className="block text-[#EEEEEE] mb-1">Nombre del conductor</label>
            <select
              name="id_conductor"
              value={formData.id_conductor}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#222831] text-[#EEEEEE] border border-[#00ADB5]"
              required
            >
              <option value="">Seleccionar conductor</option>
              {usuarios.map((usuario) => (
                <option key={usuario._id} value={usuario._id}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* RESTO DEL FORMULARIO... igual que antes */}
          {/* FECHA, RESULTADO, OBSERVACIONES, ARCHIVO, BOTONES */}

          <div>
            <label className="block text-[#EEEEEE] mb-1">Fecha y hora del examen</label>
            <input
              type="datetime-local"
              name="fecha_hora"
              value={formData.fecha_hora}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#222831] text-[#EEEEEE] border border-[#00ADB5]"
              required
            />
          </div>

          <div>
            <label className="block text-[#EEEEEE] mb-1">Resultado (mg/L)</label>
            <input
              type="number"
              step="0.01"
              name="resultado"
              value={formData.resultado}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#222831] text-[#EEEEEE] border border-[#00ADB5]"
              placeholder="Ej: 0.35"
              required
            />
          </div>

          <div>
            <label className="block text-[#EEEEEE] mb-1">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#222831] text-[#EEEEEE] border border-[#00ADB5]"
              rows={3}
              placeholder="Detalles relevantes del examen"
            />
          </div>

          <div>
            <label className="block text-[#EEEEEE] mb-1">Subir archivo</label>
            <input
              type="file"
              name="archivo"
              accept=".pdf,.jpg,.png"
              onChange={handleChange}
              className="text-[#EEEEEE]"
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="submit"
              className="bg-[#00ADB5] hover:bg-[#00c8d4] text-[#222831] px-5 py-2 rounded-lg font-semibold"
            >
              Subir Examen
            </button>
            <button
              type="reset"
              className="border border-[#EEEEEE] text-[#EEEEEE] px-5 py-2 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}