import Usuario from "../models/Usuario.js";

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().populate('rol'); // Esto es para incluir la información del rol
        res.json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al obtener los usuarios" });
    }
};


const registrarUsuario = async(req, res) =>{
    const {nombre, apellidos, numero_doc, rol} = req.body;
    const exiteUsuario = await Usuario.findOne({numero_doc})

    //Condicional comprueba el email
    if (exiteUsuario) {
        const error = new Error("Usuario ya existe")
        return res.status(400).json({msg: error.message})
    }
    try {
        const usuario = new Usuario(req.body)
        // usuario.token = generarId()
        await usuario.save()
        res.json({msg: 'Usuario Creado Correctamente'})
    } catch (error) {
        console.log(error)
    }
}

const editarUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findById(id);
        
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Verifica si intentan cambiar el numero_doc
        if (req.body.numero_doc && req.body.numero_doc !== usuario.numero_doc) {
            return res.status(400).json({ msg: "No se permite modificar el número de documento" });
        }

        // Actualizar solo campos permitidos
        usuario.nombre = req.body.nombre || usuario.nombre;
        usuario.apellidos = req.body.apellidos || usuario.apellidos;
        usuario.rol = req.body.rol || usuario.rol;

        const usuarioActualizado = await usuario.save();

        res.json({ msg: 'Usuario actualizado correctamente', usuario: usuarioActualizado });
    } catch (error) {
        console.log(error);
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

        await usuario.deleteOne();

        res.json({ msg: "Usuario eliminado correctamente" });
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

export{
    obtenerUsuarios,
    registrarUsuario,
    editarUsuario,
    eliminarUsuario,
    obtenerUsuario
    
}