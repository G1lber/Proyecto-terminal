import mongoose from 'mongoose';

const reporteSchema = new mongoose.Schema({
  chequeo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chequeo', // Asegúrate de que el modelo relacionado esté registrado como 'Chequeo'
    required: false, // Según tu SQL, este campo puede ser NULL
  },
  fecha: {
    type: Date,
    default: null,
  }
});

export default mongoose.model('Reporte', reporteSchema);