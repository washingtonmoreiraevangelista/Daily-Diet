import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import z from 'zod'
import { knex } from '../dataBase'
import { authenticate } from '../hook/auth'

export const registerDiet = async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.post('/', { preHandler: [authenticate] }, async (request, reply) => {
    const createDietBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      time: z.string(),
      is_diet: z.string(),
    })

    const { name, description, date, time, is_diet } = createDietBodySchema.parse(request.body)

    const userId = (request.user as { sub: string }).sub

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      date,
      time,
      is_diet,
      created_at: new Date().toISOString(),
      user_id: userId,
    })

    return reply.status(201).send('Dieta cadastrada com sucesso!')

  })

  app.get('/', { preHandler: [authenticate] }, async (_request, _reply) => {
    const diet = await knex('meals').select('*')
    return { diet }
  })



}