import express from 'express'
const router = express.Router()
import {
    nuevoRol
} from '../controllers/rolController.js'

router.post('/crear', nuevoRol)
export default router