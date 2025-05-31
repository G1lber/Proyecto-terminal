
const ModalUsuario = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  roles,
  loading,
  error,
  isEditMode = false,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const mostrarPassword = () => {
    const rolSeleccionado = roles.find((r) => r._id === formData.rol);
    return rolSeleccionado?.rol === "Mecanico" || rolSeleccionado?.rol === "Admin";
  };

  return (
    <div
  className="fixed inset-0 flex items-center justify-center z-50"
  onClick={onClose}
>
  <div
    className="bg-[#EEEEEE] rounded-lg p-6 max-w-md w-full shadow-lg"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-[#00ADB5]">
        {isEditMode ? "Editar" : "Crear"} usuario
      </h2>
      <button
        onClick={onClose}
        className="text-[#393E46] hover:text-[#00ADB5] font-bold text-2xl"
      >
        ×
      </button>
    </div>

    <form onSubmit={onSubmit} className="space-y-4">
      <input
        name="nombre"
        type="text"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 rounded text-[#222831] bg-white placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
      />
      <input
        name="apellidos"
        type="text"
        placeholder="Apellidos"
        value={formData.apellidos}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 rounded text-[#222831] bg-white placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
      />
      <input
        name="numero_doc"
        type="text"
        placeholder="Número de documento"
        value={formData.numero_doc}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 rounded text-[#222831] bg-white placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
      />
      <select
        name="rol"
        value={formData.rol}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 rounded text-[#222831] bg-white placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
      >
        <option value="" disabled>
          Selecciona un rol
        </option>
        {roles.map((rol) => (
          <option key={rol._id} value={rol._id}>
            {rol.rol}
          </option>
        ))}
      </select>

      {mostrarPassword() && (
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          // Aquí la magia: required solo si NO es modo edición
          required={!isEditMode}
          className="w-full px-3 py-2 rounded text-[#222831] bg-white placeholder-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] shadow-sm"
        />
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded text-[#393E46] hover:bg-[#393E46] hover:text-[#EEEEEE] transition"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#00ADB5] text-white px-4 py-2 rounded hover:bg-[#00bfc8] transition"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default ModalUsuario;