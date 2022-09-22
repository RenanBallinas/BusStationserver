import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
//importar multer
import multer from 'multer';
import {v4 as uuid} from 'uuid';

//importar las rutas
import router from './routes';

//importar mongoose
import mongoose from 'mongoose';


//conexión a la bd en mongoDB
mongoose.Promise=global.Promise;
const dbURL='mongodb://localhost:27017/serverbus';
mongoose.connect(dbURL, {useNewURLParser: true, useUnifiedTopology: true})
.then(mongoose=>console.log('conectado al servidor de bd'))
.catch(err=>console.log(err));
//conectado al servidor de bd
//heredando de la clase express
const app=express();

//definicion de puerto
app.set('port', process.env.PORT|| 4000);

//midlewares de conexion HTTP
app.use(morgan("dev"));
app.use(cors());

//validacion de datos
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
//Carga de archivos

const storage=multer.diskStorage({
destination:(req, file, cb)=>{
    cb(null, 'public/imagenes')
    },
    filename:(req, file, cb)=>{
        cb(null, uuid() + path.extname(file.originalname))
    }
});
app.use(multer({storage:storage}).single('image'));

//Definición de rutas 
app.use('/server', router);
//ahi puede ser api o dependiendo el proyecto ejem consulta
app.listen(app.get('port'),()=>{
    console.log('servidor se ejecuta en el puerto'+ app.get('port'))
    //servidor se ejecuta en el puerto
});