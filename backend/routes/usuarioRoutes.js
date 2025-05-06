import express from 'express'
const router = express.Router();

import {
    registrar
} from "../controllers/usurioController.js"

router.post('/', registrar)

export default router