import express from 'express'
const router = express.Router();

import {
    obtenerUsuarios,
    registrarUsuario,
    editarUsuario,
    eliminarUsuario, 
    obtenerUsuario
} from "../controllers/usurioController.js"

router.get('/', obtenerUsuarios);
router.post('/crear', registrarUsuario)
router
        .route("/:id")
        .put(editarUsuario)
        .delete(eliminarUsuario)
        .get(obtenerUsuario)

export default router