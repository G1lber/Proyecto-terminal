import mongoose from 'mongoose';

const chequeoSchema = new mongoose.Schema({
  id_bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Buses', required: true },
  id_mecanico: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  id_conductor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },

  luces: {
    luces_freno: { type: Boolean, default: false },
    direccionales: { type: Boolean, default: false },
    reversa: { type: Boolean, default: false },
    luz_interna: { type: Boolean, default: false },
    bajas: { type: Boolean, default: false },
    altas: { type: Boolean, default: false },
    farolas: { type: Boolean, default: false },
    estacionarias: { type: Boolean, default: false }
  },

  vidrios: {
    parabrisas: { type: Boolean, default: false },
    laterales: { type: Boolean, default: false },
    retrovisores: { type: Boolean, default: false },
    vidrio_trasero: { type: Boolean, default: false },
    claraboyas: { type: Boolean, default: false }
  },

  seguridad: {
    bocina: { type: Boolean, default: false },
    cinturones_delanteros: { type: Boolean, default: false },
    cinturones_traseros: { type: Boolean, default: false },
    alarma_reversa: { type: Boolean, default: false },
    manijas_puertas: { type: Boolean, default: false }
  },

  emergencia: {
    linterna_pilas: { type: Boolean, default: false },
    botiquin: { type: Boolean, default: false },
    extintor: { type: Boolean, default: false },
    martillos: { type: Boolean, default: false },
    herramienta_basica: { type: Boolean, default: false },
    conos_reflectores: { type: Boolean, default: false }
  },

  niveles: {
    aceite: { type: Boolean, default: false },
    refrigerante: { type: Boolean, default: false },
    liquido_frenos: { type: Boolean, default: false },
    combustible: { type: Boolean, default: false },
    aceite_hidraulico: { type: Boolean, default: false }
  },

  estado_mecanico: {
    motor_ok: { type: Boolean, default: false },
    frenos_ok: { type: Boolean, default: false },
    luces_ok: { type: Boolean, default: false },
    llantas_ok: { type: Boolean, default: false },
    tanque_lleno: { type: Boolean, default: false }
  },

  fecha_hora: { type: Date, required: true },
  firma_mecanico: { type: String, required: true },
  firma_conductor: { type: String, required: true }
}, {
  collection: 'chequeos',
  timestamps: true,
  versionKey: false
});

export default mongoose.model('Chequeo', chequeoSchema);