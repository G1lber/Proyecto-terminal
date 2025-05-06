import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    default: null
  },
  apellidos: {
    type: String,
    default: null
  },
  numero_doc: {
    type: Number,
    unique: true,
    sparse: true // permite múltiples null si no quieres que falle
  },
  rol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rol',
    default: null
  }
}, {
  collection: 'usuarios',
  versionKey: false
});

export default mongoose.model('Usuario', usuarioSchema);