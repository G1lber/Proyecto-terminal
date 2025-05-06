import express from 'express'
const router = express.Router()
import {
    nuevoRol
} from '../controllers/rolController.js'

router.post('/', nuevoRol)
export default router