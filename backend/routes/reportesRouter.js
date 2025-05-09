import express from 'express'
const router = express.Router()
import {
    crearReporte
} from '../controllers/reporteController.js'

router.post('/crear', crearReporte)
export default router