import Rol from "../models/Rol.js";

const  nuevoRol = async (req, res) =>{
    const {rol} = req.body;
    const exiteRol= await Rol.findOne({rol})
    if (exiteRol) {
        const error = new Error("Rol ya existe")
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
const listarRoles = async (req, res) => {
  try {
    const roles = await Rol.find().select('_id rol'); // selecciona campos que quieres enviar
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener roles' });
  }}
export{
    nuevoRol,
    listarRoles 
}