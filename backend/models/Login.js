import mongoose from 'mongoose';

const loginSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  password: {
    type: String,
    required: true,
    maxlength: 100
  }
}, {
  collection: 'login',
  versionKey: false
});

const Login = mongoose.model('Login', loginSchema);
export default Login;