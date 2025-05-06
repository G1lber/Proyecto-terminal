import mongoose from 'mongoose';

const rolSchema = new mongoose.Schema({
  rol: {
    type: String,
    default: null
  }
}, {
  collection: 'rol',
  versionKey: false
});

export default mongoose.model('Rol', rolSchema);