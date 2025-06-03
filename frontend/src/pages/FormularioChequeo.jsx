import React from "react";

export default function FormularioChequeo() {
  return (
    <div className="min-h-screen bg-[#EEEEEE] text-[#222831] p-6">
      <div className="max-w-4xl mx-auto bg-[#393E46] p-10 rounded-2xl shadow-xl text-[#EEEEEE]">
        <h1 className="text-4xl font-bold mb-10 text-[#00ADB5] text-center">
          Formulario de Chequeo
        </h1>

        {/* Categorías */}
        {[
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
        ].map((seccion) => (
          <fieldset key={seccion.titulo} className="mb-8 border-b border-[#00ADB5] pb-6">
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
                    name={`${seccion.titulo.toLowerCase().replace(/ /g, "_")}.${campo}`}
                    className="accent-[#00ADB5] w-4 h-4"
                  />
                  {campo.replace(/_/g, " ")}
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        {/* Firmas y fecha */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <label className="flex flex-col text-[#EEEEEE]">
            <span className="mb-1 text-[#00ADB5] font-medium">Fecha y Hora:</span>
            <input
              type="datetime-local"
              className="p-2 rounded-lg bg-[#222831] border border-[#00ADB5] text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
            />
          </label>

          <label className="flex flex-col text-[#EEEEEE]">
            <span className="mb-1 text-[#00ADB5] font-medium">Firma del mecánico:</span>
            <input
              type="text"
              className="p-2 rounded-lg bg-[#222831] border border-[#00ADB5] text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
            />
          </label>

          <label className="flex flex-col md:col-span-2 text-[#EEEEEE]">
            <span className="mb-1 text-[#00ADB5] font-medium">Firma del conductor:</span>
            <input
              type="text"
              className="p-2 rounded-lg bg-[#222831] border border-[#00ADB5] text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
            />
          </label>
        </div>

        {/* Botón */}
        <div className="text-center mt-10">
          <button className="bg-[#00ADB5] text-[#222831] py-3 px-8 rounded-full font-bold text-lg hover:bg-[#00cfd8] transition-all shadow-md hover:shadow-lg">
            Guardar Chequeo
          </button>
        </div>
      </div>
    </div>
  );
}