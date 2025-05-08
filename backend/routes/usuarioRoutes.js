import express from 'express'
const router = express.Router();

import {
    obtenerUsuarios,
    registrarUsuario,
    editarUsuario,
    eliminarUsuario, 
    obtenerUsuario,
    registrarExamen,
    loginUsuario
} from "../controllers/usurioController.js"

import checkAuth from '../middleware/checkAuth.js';

router.post('/',loginUsuario );
router.get('/listar', checkAuth, obtenerUsuarios);
router.post('/crear', checkAuth, registrarUsuario)
router.post('/examenalcohol',checkAuth, registrarExamen)
router
        .route("/:id")
        .put(checkAuth, editarUsuario)
        .delete(checkAuth, eliminarUsuario)
        .get(checkAuth, obtenerUsuario)

export default router