import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import environment from './environment/environment.js'
import routes from './routes/routes.js'
import './database/database.js'

// Initiate
const app = express()

// Set up
app.use(helmet())
app.use(express.json())
app.use(
  cors({
    origin: environment.ORIGIN_URL,
    methods: ['GET, POST, PUT, DELETE'],
    allowedHeaders: ['Content-Type, api_key'],
    credentials: true
  })
)
app.use(
  rateLimit({
    windowMs: 900000, // 15 minutes
    max: 100,
    message: 'Too many requests. Please try again later.',
    headers: true
  })
)

// Router
app.use('/api/task-manager', routes)

// Server
const server = app.listen(environment.PORT, () =>
  console.log(`Service running on port ${environment.PORT}`)
)

// export default app
export { app, server }
