import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  placa: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 20
  },
  num_identificacion_empresa: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  estado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estado',
    required: true
  },
  id_empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    default: null
  },
  conductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  copiloto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  },
  dueño: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  },
  soat: {
    type: Boolean,
    default: null
  },
  tecno_mecanica: {
    type: Boolean,
    default: null
  }
}, {
  collection: 'buses',
  versionKey: false
});

export default mongoose.model('Buses', busSchema);