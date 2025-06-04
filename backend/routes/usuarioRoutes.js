import express from 'express'
const router = express.Router();
import multer from 'multer';
const upload = multer();

import {
    obtenerUsuarios,
    registrarUsuario,
    editarUsuario,
    eliminarUsuario, 
    obtenerUsuario,
    registrarExamen,
    loginUsuario,
    perfil,
    buscarUsuarios
} from "../controllers/usurioController.js"

import checkAuth from '../middleware/checkAuth.js';

router.post('/',loginUsuario );
router.get('/listar', checkAuth, obtenerUsuarios);
router.get('/buscar', checkAuth, buscarUsuarios);
router.post('/crear', checkAuth, registrarUsuario)
router.get('/perfil', checkAuth, perfil);
router.post('/examenalcohol', checkAuth, registrarExamen);
router
        .route("/:id")
        .put(checkAuth, editarUsuario)
        .delete(checkAuth, eliminarUsuario)
        .get(checkAuth, obtenerUsuario)

export default router