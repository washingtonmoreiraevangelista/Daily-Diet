import { randomUUID } from 'crypto'
import { knex } from '../dataBase'
import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'
import z from 'zod'
import { authorizeAdmin } from '../hook/auth'

export async function adminRouter(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.post(
    '/user',
    async (request, reply) => {
      const createAdminUserBodySchema = z.object({
        name: z.string(),
        password: z.string(),
        role: z
          .string()
          .transform(val => val.toLowerCase())
          .refine(val => val === 'admin', { message: 'Role deve ser "admin"' })
          .transform(() => 'Admin'),
      })

      const { name, password, role } = createAdminUserBodySchema.parse(request.body)

      const existing = await knex('users').where({ name }).first()

      if (existing) {
        return reply.code(400).send({ message: 'Usuário já existe.' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      await knex('users').insert({
        id: randomUUID(),
        name,
        password: hashedPassword,
        role,
      })

      return reply.code(201).send({ message: 'Usuário master criado com sucesso.' })
    }
  )

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
      return reply.code(401).send({ error: 'Credenciais inválidas' })
    }

    const token = app.jwt.sign(
      {
        sub: user.id,
        role: user.role, 
      },
      { expiresIn: '7d' }
    )


    return reply.send({ message: 'login realizado com sucesso ', token })
  })



  app.get('/users', { preHandler: [authorizeAdmin] }, async (_request, reply) => {
    const users = await knex('users').select('*')


    if (!users) {
      return reply.code(404).send({ error: 'User not found' })
    }

    return reply.code(200).send({ users })

  })

  app.get('/:id', { preHandler: [authorizeAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const user = await knex('users')
      .select('*')
      .where({ id })
      .first()

    if (!user) {
      return reply.code(404).send({ error: 'User not found' })
    }

    return { user }

  })

  app.delete('/users/:id', { preHandler: [authorizeAdmin] },async (request, reply) => {
    const { id } = request.params as { id: string }

    const user = await knex('users')
      .where({ id })
      .del()

    if (!user) {
      return reply.code(404).send({ error: 'User not found' })
    }

    return { user }

  })



}

