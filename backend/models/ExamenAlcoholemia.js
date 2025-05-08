import mongoose from 'mongoose';

const examenSchema = new mongoose.Schema({
    id_conductor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    resultado: {
      type: Number,
      default: 0,
      required: true
    },
    fecha_hora: {
      type: Date,
      required: true
    }
  }, {
    collection: 'examenalcoholemia',
    versionKey: false,
    timestamps: true // Esto añade createdAt y updatedAt automáticamente
  });

export default mongoose.model('ExamenAlcoholemia', examenSchema);