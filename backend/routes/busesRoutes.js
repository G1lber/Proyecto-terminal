import express from 'express'
const router = express.Router()
import {
    crearEmpresa,
    agregarBus,
    editarBus,
    eliminarBus,
    listarBuses,
    listarEstados,
    listarEmpresas,
    obtenerBusesPorEstado,
    obtenerBusesDisponibles,
} from '../controllers/busesController.js'

router.post('/empresa', crearEmpresa)
router.post('/crear', agregarBus)
router.get('/', listarBuses)
router.get('/disponibles', obtenerBusesDisponibles)
router.get('/estados', listarEstados)
router.get('/listar-empresa', listarEmpresas)
router.get('/busesporestado', obtenerBusesPorEstado)
router
        .route("/:id")
        .put(editarBus)
        .delete(eliminarBus)
export default router