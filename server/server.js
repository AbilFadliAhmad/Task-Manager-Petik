import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { connectDb } from './config/Db.js'
import { errorHandler, RouteNotFound } from './middlewares/errorMiddleware.js'
import { userRoute } from './routes/UserRoute.js'
import { taskRoute } from './routes/TaskRoute.js'
import { connectCloudinary } from './middlewares/muttler.js'

// Middleware
const app = express()
const port = process.env.PORT || 4000
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(morgan('dev'))

// Route
app.use('/api/user', userRoute)
app.use('/api/task', taskRoute)

// Middleware menangani kesalahan
app.use(RouteNotFound)
app.use(errorHandler)

connectDb();
connectCloudinary();


app.listen(port, ()=>console.log(`Server sekarang berjalan di PORT: ${port}`))