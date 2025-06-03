import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './router/users'
import { registerDiet } from './router/diet'
import { fastifyJwt } from 'fastify-jwt'

export const app = fastify()

app.get('/hello', async () => {
  return('ola mundo')
})

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || '',
})

app.register(cookie)

app.register(usersRoutes, {
  prefix: '/users',
})

app.register(registerDiet, {
  prefix: '/diet',
})

