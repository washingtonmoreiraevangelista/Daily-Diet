import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../dataBase'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'
import { authorizeAdmin } from '../hook/auth'
export async function usersRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.post('/register', async (request, reply) => {
    const createUserSchema = z.object({
      userName: z.string(),
      email: z.string().email(),
      password: z.string(),
      role: z.enum(['Admin', 'user']).default('user'),
    })

    const { userName, password, email, role } = createUserSchema.parse(request.body)
    const normalizedUserName = userName.toLowerCase().replace(/\s/g, '')
    const normalizedEmail = email.toLowerCase()

    const existingUser = await knex('users')
      .whereRaw('LOWER(REPLACE(userName, \' \', \'\')) = ?', normalizedUserName)
      .orWhereRaw('LOWER(email) = ?', normalizedEmail)
      .first()

    if (existingUser) {
      return reply.code(400).send({ message: 'Usuário ou e-mail já cadastrado.' })
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    if (!passwordRegex.test(password)) {
      return reply.code(400).send({
        error: 'A senha deve conter pelo menos 8 caracteres, incluindo letras e números.',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 8)
    const userId = randomUUID()

    await knex('users').insert({
      id: userId,
      userName,
      email,
      password: hashedPassword,
      role,
      profilePicture: null,
      createdAt: new Date().toISOString().split('T')[0],
    })

    const token = app.jwt.sign({}, { sub: userId, expiresIn: '1d' })

    return reply.code(201).send({ message: 'Usuário criado com sucesso!', token })
  })


  app.post('/login', async (request, reply) => {
    const loginBodySchema = z.object({
      userName: z.string(),
      password: z.string(),
    })

    const { userName, password } = loginBodySchema.parse(request.body)

    const user = await knex('users')
      .whereRaw('LOWER(REPLACE(userName, \' \', \'\')) = ?', userName.toLowerCase().replace(/\s/g, ''))
      .first()

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.code(401).send({ error: 'Credenciais inválidas' })
    }

    const token = app.jwt.sign(
      {
        sub: user.id,
        role: user.role,
      },
      { expiresIn: '1d' }
    )

    return reply.send({ message: 'login realizado com sucesso ', token })
  })
  

  app.get('/all', { preHandler: [authorizeAdmin] }, async (_request, reply) => {
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

  app.delete('/:id', { preHandler: [authorizeAdmin] }, async (request, reply) => {
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