import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import z from 'zod'
import { knex } from '../dataBase'
import { authenticate } from '../hook/auth'

export const registerDiet = async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.post('/register', { preHandler: [authenticate] }, async (request, reply) => {
    const createDietBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      time: z.string(),
      isDiet: z.string(),
    })

    const { name, description, date, time, isDiet, } = createDietBodySchema.parse(request.body)

    const userId = (request.user as { sub: string }).sub

    const meal = {
      id: randomUUID(),
      name,
      description,
      date,
      time,
      isDiet,
      userId: userId,
    }

    await knex('meals').insert(meal)

    return reply.code(201).send('Dieta cadastrada com sucesso!')
  })

  app.get('/all', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { sub: string }).sub

    const { page = 1, limit = 10 } = request.query as { page?: number, limit?: number }

    const pageNumber = page
    const limitNumber = limit

    const offset = (pageNumber - 1) * limitNumber

    const [total] = await knex('meals').where({ userId }).count<{ count: string }[]>('id as count')

    const meals = await knex('meals')
      .where({ userId })
      .limit(limitNumber)
      .offset(offset)
      .select()

    if (meals.length === 0) {
      return reply.code(400).send({ mesage: 'Nenhuma dieta registrada!' })
    }

    return reply.code(200).send({
      meals,
      total: Number(total.count),
      page: pageNumber,
      limit: limitNumber,
    })

  })

  // app.get('/:id', { preHandler: [authenticate] }, async (request, reply) => {
  //   const userId = (request.user as { sub: string }).sub
  //   const { id } = request.params as { id: string }

  //   if (!id) {
  //     return reply.code(400).send({ mesage: 'Id não encontrado!' })
  //   }

  //   const diet = await knex('meals')
  //     .where({ id, userId: userId })
  //     .first()

  //   return reply.send({ diet })

  // })


  // app.put('/:id', { preHandler: [authenticate] }, async (request, reply) => {
  //   const userId = (request.user as { sub: string }).sub
  //   const { id } = request.params as { id: string }

  //   const { name, description, date, time, is_diet } = request.body as {
  //     name: string,
  //     description: string,
  //     date: string,
  //     time: string,
  //     is_diet: string,
  //   }

  //   if (id) {
  //     return reply.code(400).send({ mesage: 'Id não encontrado!' })
  //   }

  //   const diet = await knex('meals')
  //     .where({ id, userId: userId })
  //     .update({
  //       name,
  //       description,
  //       date,
  //       time,
  //       is_diet,
  //     })

  //   return reply.code(200).send({ message: 'Dieta atualizada com sucesso!' })

  // })


  // app.delete("/:id", { preHandler: [authenticate] }, async (request, reply) => {
  //   const userId = (request.user as { sub: string }).sub
  //   const { id } = request.params as { id: string }

  //   const diet = await knex('meals')
  //     .where({ id, userId: userId })
  //     .del()

  //   if (!diet) {
  //     return reply.code(400).send({ message: 'Dieta não encontrada ou não pertence ao usuário!' })
  //   }

  //   return reply.code(200).send({ message: 'Dieta deletada com sucesso!' })
  // })

  // app.get('/metrics', { preHandler: [authenticate] }, async (request, reply) => {
  //   const userId = (request.user as { sub: string }).sub


  //   const allDiet = await knex('meals')
  //     .where({ userId: userId })
  //     .select('*')
  //     .orderBy('date', 'asc')

  //   const totalDiet = allDiet.length
  //   const withinDiet = allDiet.filter((meal) => meal.is_diet === 'sim').length
  //   const outDiet = totalDiet - withinDiet

  //   let bestSequence = 0
  //   let currentSequence = 0

  //   //for..in
  //   for (const meal of allDiet) {
  //     // Verifica se a refeição está dentro da dieta
  //     if (meal.is_diet === 'sim') {
  //       currentSequence++
  //       // Atualiza a melhor sequência
  //       bestSequence = Math.max(bestSequence, currentSequence)
  //     } else {
  //       // Reinicia a sequência se a refeição está fora da dieta
  //       currentSequence = 0
  //     }
  //   }

  //   return reply.send({
  //     totalMeals: totalDiet,
  //     withinDiet,
  //     outDiet,
  //     bestDietSequence: bestSequence,
  //   })

  // })



}