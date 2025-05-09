import express from 'express'
const router = express.Router()
import { 
    crearChequeo,
    editarChequeo,
    eliminarChequeo,
    listarChequeos
 } from '../controllers/chequeoControlles.js'

router.get('/', listarChequeos) 
router.post('/crear', crearChequeo) 

router
         .route("/:id")
         .put(editarChequeo)
         .delete(eliminarChequeo)
export default router