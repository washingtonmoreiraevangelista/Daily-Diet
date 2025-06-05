import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../dataBase'
import { randomUUID } from 'node:crypto'
import { authenticate } from '../hook/auth'
import bcrypt from 'bcrypt'
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

    if (password.length !== 8) {
      throw new Error("Password must contain exactly 8 characters.")
    }

    // Removir a função session id pelo jwt

    // const sessionId = randomUUID()

    // reply.cookie('sessionId', sessionId, {
    //   path: '/',
    //   maxAge: 1000 * 60 * 60 * 24 * 7,
    //   httpOnly: true,
    // })


    if (!name || !password) {
      return reply.status(400).send({ error: 'Name and password are required' })
    }

    const userId = randomUUID()
    const hashedPassword = await bcrypt.hash(password, 8)

    await knex('users').insert({
      id: userId,
      name,
      password: hashedPassword,
      created_at: new Date().toISOString()
    })

    const token = app.jwt.sign({}, { sub: userId, expiresIn: '30m' })

    return reply.status(201).send({ message: 'Usuário criado com sucesso!', token })


  })


  app.post('/login', async (request, reply) => {
    const loginBodySchema = z.object({
      name: z.string(),
      password: z.string(),
    })

    const { name, password } = loginBodySchema.parse(request.body)

    const user = await knex('users')
      .where({ name })
      .first()

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.status(401).send({ error: 'Credenciais inválidas' })
    }

    const token = app.jwt.sign({}, { sub: user.id, expiresIn: '30m' })

    return reply.send({ message: 'login realizado com sucesso ', token })

  })


  app.get('/', { preHandler: [authenticate] }, async (_request, _reply) => {
    const users = await knex('users').select('*')
    return { users }

  })

  app.get('/:id', { preHandler: [authenticate] }, async (request, reply) => {
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

  app.delete('/:id', { preHandler: [authenticate] }, async (request, reply) => {
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