import Usuario from "../models/Usuario.js";
import Empresa from '../models/Empresa.js';
import Buses from '../models/Buses.js';
import Estado from '../models/Estado.js';



const listarEstados = async (req, res) => {
  try {
    const estados = await Estado.find()
    res.json(estados)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los estados' })
  }
}

const crearEmpresa = async (req, res) => {
  try {
    const { nombre, direccion, telefono } = req.body;

    // Validación simple
    if (!nombre || !direccion || !telefono) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    const empresa = new Empresa({ nombre, direccion, telefono });
    await empresa.save();

    res.status(201).json({ msg: 'Empresa creada correctamente', empresa });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear la empresa' });
  }
};
const listarEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.find(); // lista todas las empresas
    res.json(empresas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener las empresas' });
  }
};
const listarBuses = async (req, res) => {
    try {
      // Obtener todos los buses de la base de datos
      const buses = await Buses.find()
        .populate('estado', 'estado') // Poblamos el campo 'estado' con los detalles del estado
        .populate('id_empresa', 'nombre') // Poblamos el campo 'id_empresa' con el nombre de la empresa
        .populate('conductor', 'nombre') // Poblamos el campo 'conductor' con el nombre del conductor
        .populate('copiloto', 'nombre') // Poblamos el campo 'copiloto' con el nombre del copiloto
        .populate('dueño', 'nombre'); // Poblamos el campo 'dueño' con el nombre del dueño
  
      res.status(200).json(buses); // Devolver los buses encontrados
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Error al obtener los buses' });
    }
  };


const agregarBus = async (req, res) => {
  try {
    let {
      placa,
      num_identificacion_empresa,
      estado,
      id_empresa,
      conductor,
      copiloto,
      dueño,
      soat,
      tecno_mecanica,
    } = req.body;

    // Convertir valores vacíos a null
    if (copiloto === '') copiloto = null;

    // Validar existencia de empresa si se proporciona
    if (id_empresa) {
      const empresaExiste = await Empresa.findById(id_empresa);
      if (!empresaExiste) {
        return res.status(400).json({ msg: 'La empresa no existe' });
      }
    }

    // Validar existencia del conductor
    const conductorExiste = await Usuario.findById(conductor);
    if (!conductorExiste) {
      return res.status(400).json({ msg: 'Conductor no válido' });
    }

    // Validar copiloto si se proporciona
    if (copiloto && !(await Usuario.findById(copiloto))) {
      return res.status(400).json({ msg: 'Copiloto no válido' });
    }

    // Validar dueño si se proporciona
    if (dueño && !(await Usuario.findById(dueño))) {
      return res.status(400).json({ msg: 'Dueño no válido' });
    }

    // Validar existencia del estado
    const estadoExiste = await Estado.findById(estado);
    if (!estadoExiste) {
      return res.status(400).json({ msg: 'Estado no válido' });
    }

    // Crear el bus
    const nuevoBus = new Buses({
      placa,
      num_identificacion_empresa,
      estado: estadoExiste._id,
      id_empresa,
      conductor,
      copiloto,
      dueño,
      soat,
      tecno_mecanica,
    });

    const busGuardado = await nuevoBus.save();
    res.status(201).json(busGuardado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al crear el bus' });
  }
};
  const editarBus = async (req, res) => {
    try {
      const { id } = req.params;
      const { placa, num_identificacion_empresa, estado, id_empresa, conductor, copiloto, dueño, soat, tecno_mecanica } = req.body;
  
      // Validar si el num_identificacion_empresa ya existe (excepto para el bus que se está editando)
      const busExistente = await Buses.findOne({ num_identificacion_empresa });
      if (busExistente && busExistente._id.toString() !== id) {
        return res.status(400).json({ msg: 'El número de identificación de la empresa ya está registrado en otro bus.' });
      }
  
      // Validar existencia de empresa
      const empresaExiste = await Empresa.findById(id_empresa);
      if (!empresaExiste) {
        return res.status(400).json({ msg: 'La empresa no existe' });
      }
  
      // Validar usuarios
      const conductorExiste = await Usuario.findById(conductor);
      if (!conductorExiste) return res.status(400).json({ msg: 'Conductor no válido' });
  
      if (copiloto && !(await Usuario.findById(copiloto))) {
        return res.status(400).json({ msg: 'Copiloto no válido' });
      }
  
      if (dueño && !(await Usuario.findById(dueño))) {
        return res.status(400).json({ msg: 'Dueño no válido' });
      }
  
      const estadoExiste = await Estado.findById(estado);
      if (!estadoExiste) {
        return res.status(400).json({ msg: 'Estado no válido' });
      }
  
      // Actualizar el bus
      const busActualizado = await Buses.findByIdAndUpdate(id, {
        placa,
        num_identificacion_empresa,
        estado: estadoExiste._id,
        id_empresa,
        conductor,
        copiloto,
        dueño,
        soat,
        tecno_mecanica
      }, { new: true });
  
      res.status(200).json(busActualizado);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Error al actualizar el bus' });
    }
  };
const eliminarBus = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Verificar si el bus existe
      const bus = await Buses.findById(id);
      if (!bus) {
        return res.status(404).json({ msg: 'Bus no encontrado' });
      }
  
      // Eliminar el bus
      await Buses.findByIdAndDelete(id);
  
      res.status(200).json({ msg: 'Bus eliminado correctamente' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Error al eliminar el bus' });
    }
  };
  
  
export {
    agregarBus,
    editarBus,
    crearEmpresa,
    eliminarBus,
    listarBuses,
    listarEstados,
    listarEmpresas
    };