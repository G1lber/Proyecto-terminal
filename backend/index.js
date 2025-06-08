import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import usuarioRoutes from "./routes/usuarioRoutes.js";
import rolRoutes from "./routes/rolRoutes.js";
import busesRoutes from "./routes/busesRoutes.js";
import chequeoRoutes from "./routes/chequeoRoutes.js";
import reporteRouter from "./routes/reportesRouter.js";
import checkAuth from './middleware/checkAuth.js';

dotenv.config();

const app = express();
app.use(express.json());

// CORS config
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

// Routes
app.get('/ping', (req, res) => {
  res.json({ msg: 'Servidor funcionando correctamente' });
});
app.use('/terminal/usuarios', usuarioRoutes);
app.use('/terminal/rol', rolRoutes);
app.use('/terminal/buses', checkAuth, busesRoutes);
app.use('/terminal/chequeo', checkAuth, chequeoRoutes);
app.use('/terminal/reportes', checkAuth, reporteRouter);

// DB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("🟢 Conectado a MongoDB"))
  .catch((error) => console.error("🔴 Error conectando a MongoDB:", error));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});