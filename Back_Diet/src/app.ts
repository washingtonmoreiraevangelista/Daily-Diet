import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './router/users'
import { registerDiet } from './router/diet'
import { fastifyJwt } from 'fastify-jwt'
import cors from '@fastify/cors'

export const app = fastify()

app.register(cors, {
  origin: 'http://localhost:5173', 
  credentials: true,              
})

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET! || '',
})

// app.register(cookie)

app.register(usersRoutes, {
  prefix: '/users',
})

app.register(registerDiet, {
  prefix: '/meals',
})


