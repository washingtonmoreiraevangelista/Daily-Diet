import { FastifyInstance } from 'fastify'
import { authenticate } from '../hook/auth'
import { knex } from '../dataBase'

export async function profileRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })


  app.get('/user', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { sub: string }).sub

    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' })
    }

    const user = await knex('users')
      .select('*')
      .where({ id: userId })
      .first()

    if (!user) {
      return reply.code(404).send({ error: 'User not found' })
    }

    return { user }
  })

  app.put('/update', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { sub: string }).sub

    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' })
    }

    const { userName, email, password } = request.body as {
      userName: string,
      email: string,
      password: string,
    }

    await knex('users')
      .where({ id: userId })
      .update({
        userName,
        email,
        password,
      })

    return reply.code(200).send({ message: 'Usuário atualizado com sucesso!' })

  })



}