import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './router/users'

export const app = fastify()

app.get('/hello', async () => {
  return('ola mundo')
})

app.register(cookie)
app.register(usersRoutes, {
  prefix: '/users',
})

