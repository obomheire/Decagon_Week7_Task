import express, {Request, Response, NextFunction} from 'express';
import path from 'path';
import customers from './routes/customers'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(express.json())

app.use(express.urlencoded({extended: false}))

app.use(cookieParser())

app.use(express.static(path.resolve('src/public')))

app.use('/', customers)

app.set('view engine', 'ejs')

app.set('views', `./views`)

console.log(`./views`)

export default app