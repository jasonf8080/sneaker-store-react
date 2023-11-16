import express from 'express';
import "express-async-errors"
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import morgan from "morgan";
import connectDB from './db/connect.js';
import cookieParser from "cookie-parser";

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';


import helmet from "helmet";
import cors from "cors";
import xss from "xss-clean"


//Routers
import authRouter from './routes/authRouter.js'
import productsRouter from './routes/productsRouter.js'
import reviewsRouter from './routes/reviewsRouter.js'
import cartItemRouter from './routes/cartItemRouter.js'







//Middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

const port = process.env.PORT || 5000;

const __dirname = dirname(fileURLToPath(import.meta.url));

if(process.env.NODE_ENV === 'development'){
    app.use((morgan('dev')))
}



app.use(express.static(path.resolve(__dirname, './client/build')))
app.use(express.json());
app.use(helmet());
app.use(cors())
app.use(xss())
app.use(cookieParser());


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/products', productsRouter)
app.use('/api/v1/reviews', reviewsRouter)
app.use('/api/v1/cart', cartItemRouter)

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
}) 


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)




const start = async() => {
    try {
        await connectDB(process.env.MONGO_URL)


        app.listen(port, () => {
            console.log(`Server is listening on ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()


