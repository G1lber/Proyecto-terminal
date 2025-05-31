import Usuario from "../models/Usuario.js";
import Rol from '../models/Rol.js';
import Login from "../models/login.js";
import ExamenAlcoholemia from "../models/Examenalcoholemia.js";
import bcrypt from 'bcrypt'; // si quieres encriptar la contraseña
import jwt from 'jsonwebtoken';

const loginUsuario = async (req, res) => {
  const { numero_doc, password } = req.body;

  try {
    // Buscar usuario por documento
    const usuario = await Usuario.findOne({ numero_doc }).populate('rol');
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Verificar que tenga Login (solo mecánico o admin deberían tenerlo)
    const login = await Login.findOne({ usuario: usuario._id });
    if (!login) {
      return res.status(403).json({ msg: "Este usuario no tiene acceso al sistema" });
    }

    // Verificar contraseña
    const passwordCorrecta = await bcrypt.compare(password, login.password);
    if (!passwordCorrecta) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      msg: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        numero_doc: usuario.numero_doc,
        rol: usuario.rol?.rol || null
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el login" });
  }
};


const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().populate('rol'); // Esto es para incluir la información del rol
        res.json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al obtener los usuarios" });
    }
};
const perfil = async(req, res) =>{
    const { usuario } = req

    res.json(usuario)
}
const buscarUsuarios = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({ msg: 'Debes enviar un término de búsqueda' });
  }

  try {
    const usuarios = await Usuario.find({
      $or: [
        { nombre: { $regex: q, $options: 'i' } },
        { numero_doc: isNaN(q) ? -1 : Number(q) } // -1 para que no devuelva nada si q no es número
      ]
    }).limit(10);

    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en la búsqueda' });
  }
};


const registrarUsuario = async (req, res) => {
    const { nombre, apellidos, numero_doc, rol, password } = req.body;
  
    try {
      const existeUsuario = await Usuario.findOne({ numero_doc });
      if (existeUsuario) {
        return res.status(400).json({ msg: "Usuario ya existe" });
      }
  
      // Verificamos que el rol exista
      const rolDoc = await Rol.findById(rol);
      if (!rolDoc) {
        return res.status(400).json({ msg: "Rol no válido" });
      }
  
      const requierePassword = ['Mecanico', 'Admin'].includes(rolDoc.rol);
  
      // Si el rol requiere contraseña pero no se proporciona, NO registrar al usuario
      if (requierePassword && !password) {
        return res.status(400).json({ msg: "Este rol requiere una contraseña para el registro" });
      }
  
      // Creamos el usuario
      const usuario = new Usuario({ nombre, apellidos, numero_doc, rol });
      await usuario.save();
  
      // Si se requiere login, lo creamos
      if (requierePassword) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const login = new Login({
          usuario: usuario._id,
          password: hashedPassword
        });
        await login.save();
      }
  
      res.json({ msg: 'Usuario creado correctamente' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al registrar usuario" });
    }
  };
  const editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellidos, rol, password } = req.body;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // No permitir cambio de número de documento
    if (req.body.numero_doc && req.body.numero_doc !== usuario.numero_doc) {
      return res.status(400).json({ msg: "No se permite modificar el número de documento" });
    }

    // Obtener rol actual y nuevo
    const rolActual = await Rol.findById(usuario.rol);
    const nuevoRol = rol ? await Rol.findById(rol) : rolActual;

    if (!nuevoRol) {
      return res.status(400).json({ msg: "Rol no válido" });
    }

    const rolCambio = rol && rol !== usuario.rol.toString();
    const requierePassword = ["Mecanico", "Administrador"].includes(nuevoRol.rol);

    // Si el rol cambia a uno que requiere contraseña y no se envía contraseña válida
    if (rolCambio && requierePassword && (!password || password.trim() === "")) {
      return res.status(400).json({ msg: "Este rol requiere una contraseña para el registro" });
    }

    // Actualizar campos generales
    usuario.nombre = nombre || usuario.nombre;
    usuario.apellidos = apellidos || usuario.apellidos;
    usuario.rol = rol || usuario.rol;

    // Guardar usuario actualizado sin password aún
    const usuarioActualizado = await usuario.save();

    // Actualizar la contraseña solo si:
    // - El rol requiere contraseña
    // - Y se envió una contraseña no vacía
    if (requierePassword && password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      let login = await Login.findOne({ usuario: usuario._id });

      if (login) {
        login.password = hashedPassword;
        await login.save();
      } else {
        login = new Login({
          usuario: usuario._id,
          password: hashedPassword,
        });
        await login.save();
      }
    }

    res.json({ msg: "Usuario actualizado correctamente", usuario: usuarioActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar el usuario" });
  }
};



const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
  
    try {
      const usuario = await Usuario.findById(id);
  
      if (!usuario) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
      }
  
      // Eliminar el usuario
      await usuario.deleteOne();
  
      // Eliminar el login asociado si existe
      await Login.deleteOne({ usuario: usuario._id });
  
      res.json({ msg: "Usuario y login eliminados correctamente" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Error del servidor" });
    }
};

const obtenerUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findById(id).populate('rol'); //populate para poder obtener la informacion que tiene el usuario

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al obtener el usuario" });
    }
};
const registrarExamen = async (req, res) => {
    try {
      const { id_conductor, resultado, fecha_hora } = req.body;
  
      if (!id_conductor || resultado === undefined || !fecha_hora) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
      }
  
      // Verificar si el usuario existe
      const usuario = await Usuario.findById(id_conductor).populate('rol');
      if (!usuario) {
        return res.status(404).json({ msg: "Conductor no encontrado" });
      }
  
      // Verificar que tenga el rol de "Conductor"
      if (usuario.rol?.rol !== "Conductor") {
        return res.status(400).json({ msg: "El usuario no tiene el rol de Conductor" });
      }
  
      // Crear y guardar el examen
      const examen = new ExamenAlcoholemia({
        id_conductor,
        resultado,
        fecha_hora
      });
  
      await examen.save();
  
      res.status(201).json({ msg: "Examen registrado correctamente", examen });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al registrar el examen" });
    }
  };

export{
    obtenerUsuarios,
    registrarUsuario,
    editarUsuario,
    eliminarUsuario,
    obtenerUsuario,
    registrarExamen,
    loginUsuario,
    perfil,
    buscarUsuarios
}