import express from 'express'
const router = express.Router();

import {
    obtenerUsuarios,
    registrarUsuario,
    editarUsuario,
    eliminarUsuario, 
    obtenerUsuario,
    registrarExamen
} from "../controllers/usurioController.js"

router.get('/', obtenerUsuarios);
router.post('/crear', registrarUsuario)
router.post('/examenalcohol', registrarExamen)
router
        .route("/:id")
        .put(editarUsuario)
        .delete(eliminarUsuario)
        .get(obtenerUsuario)

export default router