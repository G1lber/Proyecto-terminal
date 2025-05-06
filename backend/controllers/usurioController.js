import Usuario from "../models/Usuario.js";

const registrar = async(req, res) =>{
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
export{
    registrar
}