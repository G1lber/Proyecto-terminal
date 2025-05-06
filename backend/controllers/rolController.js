import Rol from "../models/Rol.js";

const  nuevoRol = async (req, res) =>{
    const {rol} = req.body;
    const exiteRol= await Rol.findOne({rol})
    if (exiteRol) {
        const error = new Error("Usuario ya existe")
        return res.status(400).json({msg: error.message})
    }
    try {
        const rol = new Rol(req.body)
        await rol.save()
        res.json({msg: 'Rol Agregado Correctamente '})
    } catch (error) {
        console.log(error)
    }
}
export{
    nuevoRol
}