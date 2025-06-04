import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import Buses from './pages/Buses';
import RutaProtegida from './layouts/RutaProtegida';
import Busestaquilla from './pages/Busestaquilla';
import FormularioChequeo from './pages/FormularioChequeo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<RutaProtegida />}>
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/buses" element={<Buses />} />
        <Route path="/buses-taquilla" element={<Busestaquilla />} />
        <Route path="/formulario-chequeo" element={<FormularioChequeo />} />
        {/* otras rutas protegidas */}
      </Route>
    </Routes>
  );
}

export default App;