import mongoose from 'mongoose';

const estadoSchema = new mongoose.Schema({
  estado: {
    type: String,
    required: true,
    enum: ['DISPONIBLE', 'MANTENIMIENTO', 'EN REVISION'],
    trim: true
  }
}, {
  collection: 'estado',
  versionKey: false
});

export default mongoose.model('Estado', estadoSchema);