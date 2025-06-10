import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../dataBase'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'
export async function usersRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })


  app.post('/register', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      password: z.string(),
    })

    const { name, password } = createUserBodySchema.parse(request.body)

    const existingUser = await knex('users')
      .whereRaw('LOWER(name) = ?', name.toLowerCase())
      .first()

    if (existingUser) {
      return reply.code(400).send({ error: 'User already exists' })
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    if (!passwordRegex.test(password)) {
      throw new Error("A senha deve conter pelo menos 8 caracteres, incluindo letras e números.")
    }

    // Removir a função session id pelo jwt

    // const sessionId = randomUUID()

    // reply.cookie('sessionId', sessionId, {
    //   path: '/',
    //   maxAge: 1000 * 60 * 60 * 24 * 7,
    //   httpOnly: true,
    // })


    if (!name || !password) {
      return reply.code(400).send({ error: 'Name and password are required' })
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

    return reply.code(201).send({ message: 'Usuário criado com sucesso!', token })


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
      return reply.code(401).send({ error: 'Credenciais inválidas' })
    }

    const token = app.jwt.sign(
      {
        sub: user.id,
        role: user.role,
      },
      { expiresIn: '30m' }
    )


    return reply.send({ message: 'login realizado com sucesso ', token })

  })


}