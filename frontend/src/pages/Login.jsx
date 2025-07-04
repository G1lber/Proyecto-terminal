import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadFireflyPreset } from 'tsparticles-preset-firefly';
import clienteAxios from '../config/clienteAxios';
import useAuth from '../hooks/useAuth'; 

const Login = () => {
  const [numero_doc, setNumeroDoc] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuth(); // ✅ Usar el contexto


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await clienteAxios.post('/usuarios', {
        numero_doc,
        password,
      });

      localStorage.setItem('token', data.token);
      setAuth(data.usuario); // ✅ Importante para rutas protegidas
      navigate('/usuarios');
    } catch (error) {
      setMensaje(error.response?.data?.msg || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4" style={{ backgroundColor: '#222831' }}>
      

      <div
        className="relative z-10 w-full max-w-sm p-8 rounded-2xl shadow-lg"
        style={{ backgroundColor: '#393E46' }}
      >
        <h1 className="text-2xl font-bold text-center mb-6" style={{ color: '#EEEEEE' }}>
          Iniciar sesión
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Número de documento"
            value={numero_doc}
            onChange={(e) => setNumeroDoc(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2"
            style={{
              borderColor: '#00ADB5',
              color: '#EEEEEE',
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2"
            style={{
              borderColor: '#00ADB5',
              color: '#EEEEEE',
            }}
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold transition duration-200"
            style={{
              backgroundColor: '#00ADB5',
              color: '#222831',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#019CA2')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#00ADB5')}
          >
            Ingresar
          </button>
        </form>
        {mensaje && (
          <p className="mt-4 text-center text-sm" style={{ color: 'red' }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;