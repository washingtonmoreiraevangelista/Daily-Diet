import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './router/users'
import { registerDiet } from './router/diet'
import { fastifyJwt } from 'fastify-jwt'
import cors from '@fastify/cors'
import { profileRoutes } from './router/profile'
import fastifyStatic from '@fastify/static'
import path from 'path'
import fastifyMultipart from '@fastify/multipart'


export const app = fastify()

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET! || '',
})

// acesso do front para o back
app.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})


app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, 
  }
})

app.register(fastifyStatic, {
  root: path.join(__dirname,'..', 'uploads'),
  prefix: '/uploads/',
})
console.log(`FastifyStatic registrado: /uploads/ -> ${path.join(__dirname, '..', 'uploads')}`)

// app.register(cookie)

app.register(usersRoutes, {
  prefix: '/users',
})

app.register(registerDiet, {
  prefix: '/meals',
})

app.register(profileRoutes, {
  prefix: '/profile',
})




