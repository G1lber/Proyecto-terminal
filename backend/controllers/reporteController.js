import Reporte from '../models/Reporte.js';
import Chequeo from '../models/Chequeo.js';

export const crearReporte = async (req, res) => {
  try {
    const { chequeo, fecha } = req.body;

    // Validación básica
    if (!chequeo || !fecha) {
      return res.status(400).json({ msg: 'El chequeo y la fecha son obligatorios' });
    }

    // Verificar que el chequeo existe
    const chequeoExiste = await Chequeo.findById(chequeo);
    if (!chequeoExiste) {
      return res.status(404).json({ msg: 'El chequeo no existe' });
    }

    // Crear el nuevo reporte
    const nuevoReporte = new Reporte({
      chequeo,
      fecha: new Date(fecha)
    });

    const reporteGuardado = await nuevoReporte.save();
    res.status(201).json(reporteGuardado);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear el reporte' });
  }
};