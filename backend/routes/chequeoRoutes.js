import express from 'express'
const router = express.Router()
import { 
    crearChequeo,
    editarChequeo,
    eliminarChequeo,
    listarChequeos,
    buscarChequeosPorPlaca,
    buscarChequeosPorPlacaSinFiltroFecha,
    obtenerChequeoPorId,
 } from '../controllers/chequeoControlles.js'

router.get('/', listarChequeos) 
router.post('/crear', crearChequeo) 
router.get('/buscar', buscarChequeosPorPlaca)
router.get('/buscar-reportes', buscarChequeosPorPlacaSinFiltroFecha)
router.get('/:id', obtenerChequeoPorId);

router
         .route("/:id")
         .put(editarChequeo)
         .delete(eliminarChequeo)
export default router