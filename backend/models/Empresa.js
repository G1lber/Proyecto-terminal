import mongoose from 'mongoose';

const empresaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  direccion: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  telefono: {
    type: String,
    required: true,
    trim: true,
    maxlength: 15
  }
}, {
  collection: 'empresa',
  versionKey: false
});

export default mongoose.model('Empresa', empresaSchema);