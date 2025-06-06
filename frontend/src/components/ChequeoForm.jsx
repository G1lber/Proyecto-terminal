import React, { useState, useEffect } from "react";

export default function ChequeoForm({
  initialData,
  onSubmit,
  onVolver,
  buses,
  usuarios,
  modo,
}) {
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

  const [formData, setFormData] = useState(initialData || initialFormData);
  const transformarSeccion = (seccion = {}) => {
  const nueva = {};
  for (const key in seccion) {
    nueva[key] = seccion[key] ? "1" : "0";
  }
  return nueva;
};

  useEffect(() => {
  if (initialData) {
    setFormData({
      luces: transformarSeccion(initialData.luces),
      vidrios: transformarSeccion(initialData.vidrios),
      seguridad: transformarSeccion(initialData.seguridad),
      emergencia: transformarSeccion(initialData.emergencia),
      niveles: transformarSeccion(initialData.niveles),
      estado_mecanico: transformarSeccion(initialData.estado_mecanico),
      firma_mecanico: initialData.firma_mecanico || "",
      firma_conductor: initialData.firma_conductor || "",
      id_bus: initialData.id_bus?._id || initialData.id_bus || "",
      id_mecanico: initialData.id_mecanico?._id || initialData.id_mecanico || "",
      id_conductor: initialData.id_conductor?._id || initialData.id_conductor || "",
    });
  }
}, [initialData]);

  const normalizarClave = (texto) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/ /g, "_");

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

  const submitFormData = () => {
  onSubmit(formData);
  };

    const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // onSubmit fue pasado desde el padre
    };

  const handleVolverClick = () => {
    const confirmar = window.confirm(
      "¿Estás seguro de que quieres volver? Se perderán los cambios no guardados."
    );
    if (confirmar) {
      onVolver();
    }
  };

  const secciones = [
    {
      titulo: "Luces",
      campos: [
        "luces_freno",
        "direccionales",
        "reversa",
        "luz_interna",
        "bajas",
        "altas",
        "farolas",
        "estacionarias",
      ],
    },
    {
      titulo: "Vidrios",
      campos: [
        "parabrisas",
        "laterales",
        "retrovisores",
        "vidrio_trasero",
        "claraboyas",
      ],
    },
    {
      titulo: "Seguridad",
      campos: [
        "bocina",
        "cinturones_delanteros",
        "cinturones_traseros",
        "alarma_reversa",
        "manijas_puertas",
      ],
    },
    {
      titulo: "Emergencia",
      campos: [
        "linterna_pilas",
        "botiquin",
        "extintor",
        "martillos",
        "herramienta_basica",
        "conos_reflectores",
      ],
    },
    {
      titulo: "Niveles",
      campos: [
        "aceite",
        "refrigerante",
        "liquido_frenos",
        "combustible",
        "aceite_hidraulico",
      ],
    },
    {
      titulo: "Estado Mecánico",
      campos: [
        "motor_ok",
        "frenos_ok",
        "luces_ok",
        "llantas_ok",
        "tanque_lleno",
      ],
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-[#EEEEEE] text-[#222831] p-6">
      <div className="max-w-4xl mx-auto bg-[#393E46] p-10 rounded-2xl shadow-xl text-[#EEEEEE]">

        <div className="flex justify-between items-center mb-10">
            {/* Espacio vacío para balancear el botón a la derecha */}
            <div className="w-[100px]"></div>

            {/* Título centrado */}
            <h1 className="text-4xl font-bold text-[#00ADB5] text-center flex-1">
                {modo === "editar" ? "Corregir Chequeo" : "Nuevo Chequeo"}
            </h1>

            {/* Botón Volver a la derecha */}
            <button
                type="button"
                onClick={handleVolverClick}
                className="bg-[#00ADB5] text-[#222831] border border-[#00ADB5] px-4 py-2 rounded-full font-semibold hover:bg-[#dddddd] transition-all"
            >
                ← Volver
            </button>
        </div>
        

        {/* Selector de bus, mecánico, conductor */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <label className="flex flex-col">
            <span className="text-[#00ADB5] font-medium mb-1">Bus:</span>
            <select
              name="id_bus"
              value={formData.id_bus}
              onChange={handleInputChange}
              className="bg-[#222831] text-white p-2 rounded"
            >
              <option value="">Selecciona un bus</option>
              {buses.map((bus) => (
                <option key={bus._id} value={bus._id}>
                  {bus.placa}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-[#00ADB5] font-medium mb-1">Mecánico:</span>
            <select
              name="id_mecanico"
              value={formData.id_mecanico}
              onChange={handleInputChange}
              className="bg-[#222831] text-white p-2 rounded"
            >
              <option value="">Selecciona un mecánico</option>
              {usuarios
                .filter((u) => u.rol?.rol === "Mecanico")
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.nombre}
                  </option>
                ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-[#00ADB5] font-medium mb-1">Conductor:</span>
            <select
              name="id_conductor"
              value={formData.id_conductor}
              onChange={handleInputChange}
              className="bg-[#222831] text-white p-2 rounded"
            >
              <option value="">Selecciona un conductor</option>
              {usuarios
                .filter((u) => u.rol?.rol === "Conductor")
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.nombre}
                  </option>
                ))}
            </select>
          </label>
        </div>

        {/* Secciones con checkboxes */}
        {secciones.map((seccion) => {
          const clave = normalizarClave(seccion.titulo);
          return (
            <fieldset
              key={seccion.titulo}
              className="mb-8 border-b border-[#00ADB5] pb-6"
            >
              <legend className="text-2xl text-[#00ADB5] font-semibold mb-4">
                {seccion.titulo}
              </legend>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {seccion.campos.map((campo) => (
                  <label
                    key={campo}
                    className="flex items-center gap-2 capitalize"
                  >
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

        {/* Firmas */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <label className="flex flex-col text-[#EEEEEE]">
            <span className="mb-1 text-[#00ADB5] font-medium">
              Firma del mecánico:
            </span>
            <input
              type="text"
              name="firma_mecanico"
              value={formData.firma_mecanico}
              onChange={handleInputChange}
              className="p-2 rounded-lg bg-[#222831] border border-[#00ADB5] text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
            />
          </label>

          <label className="flex flex-col text-[#EEEEEE]">
            <span className="mb-1 text-[#00ADB5] font-medium">
              Firma del conductor:
            </span>
            <input
              type="text"
              name="firma_conductor"
              value={formData.firma_conductor}
              onChange={handleInputChange}
              className="p-2 rounded-lg bg-[#222831] border border-[#00ADB5] text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
            />
          </label>
        </div>

        {/* Botón de Guardar */}
        <div className="text-center mt-10">
          <button
            type="submit"
            className={`py-3 px-8 rounded-full font-bold text-lg shadow-md hover:shadow-lg transition-all ${
              modo === "editar"
                ? "bg-yellow-500 text-black hover:bg-yellow-600"
                : "bg-[#00ADB5] text-[#222831] hover:bg-[#00cfd8]"
            }`}
          >
            {modo === "editar" ? "Corregir Chequeo" : "Guardar Chequeo"}
          </button>
        </div>
      </div>
    </form>
  );
}