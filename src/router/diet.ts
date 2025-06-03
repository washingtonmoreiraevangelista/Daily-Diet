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

  app.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { sub: string }).sub
    const diet = await knex('meals').where({ user_id: userId }).select('*')

    if (diet.length === 0) {
      return reply.status(400).send({mesage:'Nenhuma dieta registrada!',diet})
    }

    return reply.status(200).send({diet})

    })

    app.get('/:id', { preHandler: [authenticate] }, async (request, reply) => {
      const {id} = request.params as { id: string }

      const diet = await knex('meals')
      .where({id})
      .first()

      return reply.send({diet})
      
    })


}