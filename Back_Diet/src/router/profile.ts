import { FastifyInstance } from 'fastify'
import { authenticate } from '../hook/auth'
import { knex } from '../dataBase'
import fs from 'fs'
import path from 'path'


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

  app.post('/avatar', { preHandler: [authenticate] }, async (request, reply) => {
    const parts = request.parts()
    let filePart: any | null = null

    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname === 'file') {
        filePart = part
        break
      }
    }

    if (!filePart) {
      return reply.code(400).send({ message: 'Nenhum arquivo enviado' })
    }

    const uploadDir = path.resolve(__dirname, '..', 'uploads')
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

    const filename = `${Date.now()}-${filePart.filename}`
    const filepath = path.join(uploadDir, filename)
    const writeStream = fs.createWriteStream(filepath)

    await new Promise((resolve, reject) => {
      filePart.file.pipe(writeStream)
      filePart.file.on('end', resolve)
      filePart.file.on('error', reject)
    })

    await knex('users')
      .where({ id: (request.user as { sub: string }).sub })
      .update({ profilePicture: filename })

    return reply.code(200).send({ message: 'Foto atualizada com sucesso', filename })
  })





}