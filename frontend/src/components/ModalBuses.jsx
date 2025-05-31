const ModalBuses = ({
  isEditMode,
  formData,
  onChange,
  onSubmit,
  onClose,
  loading,
  error,
  estados,
  usuarios,
  empresas,
}) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#EEEEEE] p-6 rounded-lg shadow-md w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-[#393E46] hover:text-[#00ADB5] font-bold text-2xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-[#00ADB5] text-center">
          {isEditMode ? "Editar Bus" : "Crear Bus"}
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="placa"
            value={formData.placa}
            onChange={onChange}
            placeholder="Placa"
            required
            className="w-full px-3 py-2 rounded text-[#222831] bg-white placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
          />

          <input
            name="num_identificacion_empresa"
            value={formData.num_identificacion_empresa}
            onChange={onChange}
            placeholder="Identificación de la Empresa"
            required
            className="w-full px-3 py-2 rounded text-[#222831] bg-white placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
          />
          <select
            name="id_empresa"
            value={formData.id_empresa}
            onChange={onChange}
            required
            className="w-full px-3 py-2 rounded text-[#222831] bg-white focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
            >
            <option value="">Selecciona una empresa</option>
            {empresas.map((empresa) => (
                <option key={empresa._id} value={empresa._id}>
                {empresa.nombre} 
                </option>
            ))}
            </select>

          <select
            name="estado"
            value={formData.estado}
            onChange={onChange}
            required
            className="w-full px-3 py-2 rounded text-[#222831] bg-white focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
          >
            <option value="">Selecciona un estado</option>
            {estados.map((estado) => (
              <option key={estado._id} value={estado._id}>
                {estado.estado}
              </option>
            ))}
          </select>

          <select
            name="conductor"
            value={formData.conductor}
            onChange={onChange}
            required
            className="w-full px-3 py-2 rounded text-[#222831] bg-white focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
          >
            <option value="">Selecciona un conductor</option>
            {usuarios.map((u) => (
              <option key={u._id} value={u._id}>
                {u.nombre} - {u.numero_doc}
              </option>
            ))}
          </select>


          <select
            name="dueño"
            value={formData.dueño}
            onChange={onChange}
            className="w-full px-3 py-2 rounded text-[#222831] bg-white focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
          >
            <option value="">Selecciona un dueño</option>
            {usuarios.map((u) => (
              <option key={u._id} value={u._id}>
                {u.nombre} - {u.numero_doc}
              </option>
            ))}
          </select>

          <select
            name="copiloto"
            value={formData.copiloto}
            onChange={onChange}
            className="w-full px-3 py-2 rounded text-[#222831] bg-white focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
          >
            <option value="">Selecciona un copiloto (opcional)</option>
            {usuarios.map((u) => (
              <option key={u._id} value={u._id}>
                {u.nombre} - {u.numero_doc}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-4">
            <label className="flex items-center text-[#222831]">
              <input
                type="checkbox"
                name="soat"
                checked={formData.soat}
                onChange={(e) =>
                  onChange({
                    target: { name: "soat", value: e.target.checked },
                  })
                }
                className="mr-2"
              />
              SOAT
            </label>
            <label className="flex items-center text-[#222831]">
              <input
                type="checkbox"
                name="tecno_mecanica"
                checked={formData.tecno_mecanica}
                onChange={(e) =>
                  onChange({
                    target: {
                      name: "tecno_mecanica",
                      value: e.target.checked,
                    },
                  })
                }
                className="mr-2"
              />
              Tecno Mecánica
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-[#393E46] hover:bg-[#393E46] hover:text-[#EEEEEE] transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#00ADB5] text-white rounded hover:bg-[#00bfc8] transition"
            >
              {loading ? "Guardando..." : isEditMode ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalBuses;
