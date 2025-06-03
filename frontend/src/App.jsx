import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import Buses from './pages/Buses';
import RutaProtegida from './layouts/RutaProtegida';
import ExamenAlc from './pages/ExamenAlc'
import Busestaquilla from './pages/Busestaquilla';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<RutaProtegida />}>
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/buses" element={<Buses />} />
        <Route path="/alcoholemia" element={<ExamenAlc />} />
        <Route path="/buses-taquilla" element={<Busestaquilla />} />
        {/* otras rutas protegidas */}
      </Route>
    </Routes>
  );
}

export default App;