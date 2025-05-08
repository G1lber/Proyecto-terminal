import express from 'express'
import conectarDB from './config/db.js';
import mongoose from "mongoose"
import dotenv from "dotenv";
// import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes.js"
import rolRoutes from "./routes/rolRoutes.js"
import busesRoutes from "./routes/busesRoutes.js"
import checkAuth from './middleware/checkAuth.js';
// import proyectoRoutes from "./routes/proyectoRoutes.js"
// import tareaRoutes from "./routes/tareaRoutes.js"

const app = express();
//Procesar la informacion tipo Json
app.use(express.json())

dotenv.config();

// conectarDB();

// //Configurar CORS
// const whitelist = [process.env.FRONTEND_URL]

// const corsOptions = {
//     origin: function(origin, callback){
//         if (whitelist.includes(origin)) {
//             //Puede consultar la API 
//             callback(null, true)
//         }else{
//             //No esta permitido el req
//             callback(new Error("Error de Cors"))
//         }
//     }    
// }
// app.use(cors(corsOptions))
// //Routing
app.use('/terminal/usuarios', usuarioRoutes )
app.use('/terminal/rol', rolRoutes )
app.use('/terminal/buses',checkAuth, busesRoutes )
// app.use('/api/tareas', tareaRoutes )

// Conexion a la base de datos
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("Conectando"))
.catch((error) =>console.log(error))

const PORT = process.env.PORT || 3000;
app.listen(3000,()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})