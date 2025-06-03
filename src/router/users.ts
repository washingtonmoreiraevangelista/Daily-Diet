import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../dataBase'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../hook/preHandler'

export async function usersRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      password: z.string(),
    })

    const { name, password } = createUserBodySchema.parse(request.body)

    const existingUser = await knex('users').where('name', name).first()

    if (existingUser) {
      return reply.status(400).send({ error: 'User already exists' })
    }

    const sessionId = randomUUID()

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    })


    if (!name || !password) {
      return reply.status(400).send({ error: 'Name and password are required' })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      password,
      session_id: sessionId,
      created_at: new Date().toISOString()
    })

    return reply.status(201).send("Usuário criado com sucesso!")

  })


  app.get('/', { preHandler: [checkSessionIdExists] }, async (_request, _reply) => {
    const users = await knex('users').select('*')
    return { users }

  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const user = await knex('users')
      .select('id', 'name', 'created_at')
      .where({ id })
      .first()

    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }

    return { user }

  })

  app.delete('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const user = await knex('users')
      .where({ id })
      .del()

    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }

    return { user }

  })





}