import Chequeo from '../models/Chequeo.js'; 
import Usuario from '../models/Usuario.js';
import Buses from '../models/Buses.js';
import Estado from '../models/Estado.js';

const crearChequeo = async (req, res) => {
  try {
    const {
      id_bus,
      id_mecanico,
      id_conductor,
      luces,
      vidrios,
      seguridad,
      emergencia,
      niveles,
      estado_mecanico,
      firma_mecanico,
      firma_conductor
    } = req.body;

    if (!id_bus || !id_mecanico || !id_conductor || !firma_mecanico || !firma_conductor) {
      return res.status(400).json({ msg: 'Faltan datos obligatorios' });
    }

    const [busExiste, mecanicoExiste, conductorExiste] = await Promise.all([
      Buses.findById(id_bus),
      Usuario.findById(id_mecanico),
      Usuario.findById(id_conductor),
    ]);

    if (!busExiste) return res.status(404).json({ msg: 'El bus no existe' });
    if (!mecanicoExiste) return res.status(404).json({ msg: 'El mecánico no existe' });
    if (!conductorExiste) return res.status(404).json({ msg: 'El conductor no existe' });

    // Función que interpreta valores "true" explícitamente
    const parseBool = (val) => {
      return val === '1' || val === 1 || val === true || val === 'true';
    };

    // Función que revisa si toda la sección está OK
    const seccionCompleta = (seccion) => {
      const valores = Object.values(seccion || {});
      if (valores.length === 0) return false; // sección vacía = no OK
      return valores.every(parseBool);
    };

    // Revisar cada sección
    const lucesOk = seccionCompleta(luces);
    const vidriosOk = seccionCompleta(vidrios);
    const seguridadOk = seccionCompleta(seguridad);
    const emergenciaOk = seccionCompleta(emergencia);
    const nivelesOk = seccionCompleta(niveles);
    const estadoMecanicoOk = seccionCompleta(estado_mecanico);

    // Logs para debugging
    console.log("Luces OK:", lucesOk);
    console.log("Vidrios OK:", vidriosOk);
    console.log("Seguridad OK:", seguridadOk);
    console.log("Emergencia OK:", emergenciaOk);
    console.log("Niveles OK:", nivelesOk);
    console.log("Estado Mecánico OK:", estadoMecanicoOk);

    // Solo si todas las secciones OK, ponemos Disponible
    const todosOk = lucesOk && vidriosOk && seguridadOk && emergenciaOk && nivelesOk && estadoMecanicoOk;

    const nuevoEstadoTexto = todosOk ? 'DISPONIBLE' : 'MANTENIMIENTO';

    const nuevoEstado = await Estado.findOne({ estado: nuevoEstadoTexto });

    if (!nuevoEstado) return res.status(500).json({ msg: `Estado '${nuevoEstadoTexto}' no encontrado` });

    await Buses.findByIdAndUpdate(id_bus, { estado: nuevoEstado._id });

    const nuevoChequeo = new Chequeo({
      id_bus,
      id_mecanico,
      id_conductor,
      luces,
      vidrios,
      seguridad,
      emergencia,
      niveles,
      estado_mecanico,
      firma_mecanico,
      firma_conductor,
      fecha_hora: new Date()
    });

    const chequeoGuardado = await nuevoChequeo.save();

    return res.status(201).json(chequeoGuardado);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error al guardar el chequeo' });
  }
};


const editarChequeo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      luces,
      vidrios,
      seguridad,
      emergencia,
      niveles,
      estado_mecanico,
      firma_mecanico,
      firma_conductor
    } = req.body;

    const chequeo = await Chequeo.findById(id);
    if (!chequeo) {
      return res.status(404).json({ msg: 'Chequeo no encontrado' });
    }

    // Actualizar campos
    chequeo.luces = luces;
    chequeo.vidrios = vidrios;
    chequeo.seguridad = seguridad;
    chequeo.emergencia = emergencia;
    chequeo.niveles = niveles;
    chequeo.estado_mecanico = estado_mecanico;
    chequeo.firma_mecanico = firma_mecanico;
    chequeo.firma_conductor = firma_conductor;
    chequeo.fecha_hora = new Date();

    // Verificar si todo está correcto para cambiar el estado del bus
    const todosOk =
      estado_mecanico.motor_ok &&
      estado_mecanico.frenos_ok &&
      estado_mecanico.luces_ok &&
      estado_mecanico.llantas_ok &&
      estado_mecanico.tanque_lleno &&

      luces.luces_freno === '1' &&
      luces.direccionales === '1' &&
      luces.reversa === '1' &&
      luces.luz_interna === '1' &&
      luces.bajas === '1' &&
      luces.altas === '1' &&
      luces.farolas === '1' &&
      luces.estacionarias === '1' &&

      vidrios.parabrisas === '1' &&
      vidrios.laterales === '1' &&
      vidrios.retrovisores === '1' &&
      vidrios.vidrio_trasero === '1' &&
      vidrios.claraboyas === '1' &&

      seguridad.bocina === '1' &&
      seguridad.cinturones_delanteros === '1' &&
      seguridad.cinturones_traseros === '1' &&
      seguridad.alarma_reversa === '1' &&
      seguridad.manijas_puertas === '1' &&

      emergencia.linterna_pilas === '1' &&
      emergencia.botiquin === '1' &&
      emergencia.extintor === '1' &&
      emergencia.martillos === '1' &&
      emergencia.herramienta_basica === '1' &&
      emergencia.conos_reflectores === '1' &&

      niveles.aceite === '1' &&
      niveles.refrigerante === '1' &&
      niveles.liquido_frenos === '1' &&
      niveles.combustible === '1' &&
      niveles.aceite_hidraulico === '1';

    const nuevoEstadoTexto = todosOk ? 'DISPONIBLE' : 'MANTENIMIENTO';
    const nuevoEstado = await Estado.findOne({ estado: nuevoEstadoTexto });

    if (!nuevoEstado) {
      return res.status(500).json({ msg: `Estado '${nuevoEstadoTexto}' no encontrado` });
    }

    // Actualizar estado del bus relacionado
    await Buses.findByIdAndUpdate(chequeo.id_bus, { estado: nuevoEstado._id });

    // Guardar chequeo actualizado
    const chequeoActualizado = await chequeo.save();
    res.json(chequeoActualizado);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el chequeo' });
  }
};
const eliminarChequeo = async (req, res) => {
  try {
    const { id } = req.params;

    const chequeo = await Chequeo.findById(id);
    if (!chequeo) {
      return res.status(404).json({ msg: 'Chequeo no encontrado' });
    }

    await Chequeo.findByIdAndDelete(id);
    res.json({ msg: 'Chequeo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el chequeo' });
  }
};
const listarChequeos = async (req, res) => {
  try {
    const chequeos = await Chequeo.find()
      .populate('id_bus', 'placa modelo') // puedes ajustar los campos del bus que quieres mostrar
      .populate('id_mecanico', 'nombre correo')
      .populate('id_conductor', 'nombre correo')
      .sort({ fecha_hora: -1 }); // ordena por fecha más reciente

    res.json(chequeos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los chequeos' });
  }
};

export{
    crearChequeo,
    editarChequeo,
    eliminarChequeo,
    listarChequeos
};