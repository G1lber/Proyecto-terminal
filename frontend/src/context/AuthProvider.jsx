import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    console.log('Auth cambió:', auth);
    const autenticarUsuario = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCargando(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/terminal/usuarios/perfil', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setAuth(data.usuario);
      } catch (error) {
        console.error('Error al autenticar:', error);
        setAuth({});
      } finally {
        setCargando(false);
      }
    };

    autenticarUsuario();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;