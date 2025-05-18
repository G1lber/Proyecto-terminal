import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [numero_doc, setNumeroDoc] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = 'http://localhost:3000/terminal/usuarios';
      const { data } = await axios.post(url, { numero_doc, password });

      localStorage.setItem('token', data.token);
      setMensaje('Inicio de sesión exitoso');
      // navigate('/dashboard');
    } catch (error) {
      setMensaje(error.response?.data?.msg || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Número de documento"
            value={numero_doc}
            onChange={(e) => setNumeroDoc(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Ingresar
          </button>
        </form>
        {mensaje && (
          <p className="mt-4 text-center text-sm text-red-600">{mensaje}</p>
        )}
      </div>
    </div>
  );
};

export default Login;

