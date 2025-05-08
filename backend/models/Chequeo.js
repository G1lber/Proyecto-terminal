import mongoose from 'mongoose';

const chequeoSchema = new mongoose.Schema({
  id_bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Buses', required: true },
  id_mecanico: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  id_conductor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  
  luces: {
    luces_freno: { type: String, default: '0' },
    direccionales: { type: String, default: '0' },
    reversa: { type: String, default: '0' },
    luz_interna: { type: String, default: '0' },
    bajas: { type: String, default: '0' },
    altas: { type: String, default: '0' },
    farolas: { type: String, default: '0' },
    estacionarias: { type: String, default: '0' }
  },

  vidrios: {
    parabrisas: { type: String, default: '0' },
    laterales: { type: String, default: '0' },
    retrovisores: { type: String, default: '0' },
    vidrio_trasero: { type: String, default: '0' },
    claraboyas: { type: String, default: '0' }
  },

  seguridad: {
    bocina: { type: String, default: '0' },
    cinturones_delanteros: { type: String, default: '0' },
    cinturones_traseros: { type: String, default: '0' },
    alarma_reversa: { type: String, default: '0' },
    manijas_puertas: { type: String, default: '0' }
  },

  emergencia: {
    linterna_pilas: { type: String, default: '0' },
    botiquin: { type: String, default: '0' },
    extintor: { type: String, default: '0' },
    martillos: { type: String, default: '0' },
    herramienta_basica: { type: String, default: '0' },
    conos_reflectores: { type: String, default: '0' }
  },

  niveles: {
    aceite: { type: String, default: '0' },
    refrigerante: { type: String, default: '0' },
    liquido_frenos: { type: String, default: '0' },
    combustible: { type: String, default: '0' },
    aceite_hidraulico: { type: String, default: '0' }
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