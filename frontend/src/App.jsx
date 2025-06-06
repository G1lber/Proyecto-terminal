import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import Buses from './pages/Buses';
import RutaProtegida from './layouts/RutaProtegida';
import Busestaquilla from './pages/Busestaquilla';
import FormularioChequeo from './pages/FormularioChequeo';
import Reportes from './pages/Reportes';
import TaquillaBuses from './pages/TaquillaBuses';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<RutaProtegida />}>
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/buses" element={<Buses />} />
        <Route path="/buses-taquilla" element={<Busestaquilla />} />
        <Route path="/formulario-chequeo" element={<FormularioChequeo />} />
        <Route path="/reportes" element={<Reportes/>} />
        {/* otras rutas protegidas */}
      </Route>
      <Route path="/taquilla" element={<TaquillaBuses />} />
    </Routes>
  );
}

export default App;