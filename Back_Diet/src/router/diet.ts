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

    const { page = '1', limit = '10' } = request.query as { page?: string, limit?: string }

    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      return reply.code(400).send({ message: 'Parâmetros page e limit inválidos' })
    }

    const offset = (pageNumber - 1) * limitNumber

    const [totalResult] = await knex('meals').where({ userId }).count<{ count: string }[]>('id as count')

    const meals = await knex('meals')
      .where({ userId })
      .limit(limitNumber)
      .orderBy('created_at', 'desc')
      .offset(offset)
      .select('*')

    return reply.code(200).send({
      meals,
      total: Number(totalResult.count),
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


  app.put('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { sub: string }).sub
    const { id } = request.params as { id: string }

    const { name, description, date, time, isDiet } = request.body as {
      name: string,
      description: string,
      date: string,
      time: string,
      isDiet: string,
    }

    if (!id) {
      return reply.code(400).send({ mesage: 'Id não encontrado!' })
    }

    await knex('meals')
      .where({ id, userId })
      .update({
        name,
        description,
        date,
        time,
        isDiet,
      })

    return reply.code(200).send({ message: 'Dieta atualizada com sucesso!' })

  })


  app.delete("/:id", { preHandler: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { sub: string }).sub
    const { id } = request.params as { id: string }

    const diet = await knex('meals')
      .where({ id, userId: userId })
      .del()

    if (!diet) {
      return reply.code(400).send({ message: 'Dieta não encontrada ou não pertence ao usuário!' })
    }

    return reply.code(200).send({ message: 'Dieta deletada com sucesso!' })
  })


  app.get('/metrics', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { sub: string }).sub
    const { startDate, endDate } = request.query as { startDate?: string; endDate?: string }

    let query = knex('meals').where({ userId })

    if (startDate) {
      query = query.andWhere('date', '>=', startDate)
    }
    if (endDate) {
      query = query.andWhere('date', '<=', endDate)
    }

    const allDiet = await query.select('*').orderBy('date', 'asc')

    const totalDiet = allDiet.length
    const withinDiet = allDiet.filter((meal) => meal.isDiet === 'sim').length
    const outDiet = totalDiet - withinDiet

    const percentWithin = totalDiet > 0 ? (withinDiet / totalDiet) * 100 : 0
    const percentOut = totalDiet > 0 ? (outDiet / totalDiet) * 100 : 0

    let bestSequence = 0
    let currentSequence = 0
    let tempStartIndex = 0
    let bestStartIndex = 0

    for (let i = 0; i < allDiet.length; i++) {
      if (allDiet[i].isDiet === 'sim') {
        if (currentSequence === 0) tempStartIndex = i
        currentSequence++
        if (currentSequence > bestSequence) {
          bestSequence = currentSequence
          bestStartIndex = tempStartIndex
        }
      } else {
        currentSequence = 0
      }
    }

    const bestSequenceDates =
      bestSequence > 0
        ? {
          startDate: allDiet[bestStartIndex].date,
          endDate: allDiet[bestStartIndex + bestSequence - 1].date,
        }
        : null

    return reply.send({
      totalMeals: totalDiet,
      withinDiet,
      outDiet,
      percentWithinDiet: Number(percentWithin.toFixed(1)),
      percentOutDiet: Number(percentOut.toFixed(1)),
      bestDietSequence: bestSequence,
      bestSequenceDates,
    })
  })




}