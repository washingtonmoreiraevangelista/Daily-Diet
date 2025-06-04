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
      is_diet: z.enum(['sim', 'não']),
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
      return reply.status(400).send({ mesage: 'Nenhuma dieta registrada!' })
    }

    return reply.status(200).send({ diet })

  })

  app.get('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { sub: string }).sub
    const { id } = request.params as { id: string }

    if (!id) {
      return reply.status(400).send({ mesage: 'Id não encontrado!' })
    }

    const diet = await knex('meals')
      .where({ id, user_id: userId })
      .first()

    return reply.send({ diet })

  })


  app.put('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { sub: string }).sub
    const { id } = request.params as { id: string }

    const { name, description, date, time, is_diet } = request.body as {
      name: string,
      description: string,
      date: string,
      time: string,
      is_diet: string,
    }

    if (id) {
      return reply.status(400).send({ mesage: 'Id não encontrado!' })
    }

    const diet = await knex('meals')
      .where({ id, user_id: userId })
      .update({
        name,
        description,
        date,
        time,
        is_diet,
      })

    return reply.status(200).send({ message: 'Dieta atualizada com sucesso!' })

  })


  app.delete("/:id", { preHandler: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { sub: string }).sub
    const { id } = request.params as { id: string }

    const diet = await knex('meals')
      .where({ id, user_id: userId })
      .del()

    if (!diet) {
      return reply.status(400).send({ message: 'Dieta não encontrada ou não pertence ao usuário!' })
    }

    return reply.status(200).send({ message: 'Dieta deletada com sucesso!' })
  })

  app.get('/metrics', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { sub: string }).sub


    const allDiet = await knex('meals')
      .where({ user_id: userId })
      .select('*')
      .orderBy('date', 'asc')

    const totalDiet = allDiet.length
    const withinDiet = allDiet.filter((meal) => meal.is_diet === 'sim').length
    const outDiet = totalDiet - withinDiet

    let bestSequence = 0
    let currentSequence = 0

    for (const meal of allDiet) {
      // Verifica se a refeição está dentro da dieta
      if (meal.is_diet === 'sim') {
        currentSequence++
        // Atualiza a melhor sequência
        bestSequence = Math.max(bestSequence, currentSequence)
      } else {
        // Reinicia a sequência se a refeição está fora da dieta
        currentSequence = 0
      }
    }
    return reply.send({
      totalMeals: totalDiet,
      withinDiet,
      outDiet,
      bestDietSequence: bestSequence,
    })

  })



}