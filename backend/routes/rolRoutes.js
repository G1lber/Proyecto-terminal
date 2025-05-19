import express from 'express'
const router = express.Router()
import {
    nuevoRol,
    listarRoles
} from '../controllers/rolController.js'

router.post('/crear', nuevoRol)
router.get('/listar', listarRoles);
export default router