export const permisosPorRol = {
  Admin: ["verReporte", "editarChequeo", "crearUsuario", "eliminarUsuario"],
  Mecanico: ["verReporte", "editarChequeo"],
  Conductor: ["verReporte"]
};

export const tienePermiso = (rol, permiso) => {
  return permisosPorRol[rol]?.includes(permiso);
};