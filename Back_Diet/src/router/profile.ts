import { FastifyInstance } from 'fastify'
import { authenticate } from '../hook/auth'
import { knex } from '../dataBase'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'
import bcrypt from 'bcrypt'



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
      userName?: string,
      email?: string,
      password?: string,
    }

    const updateData: Record<string, any> = {}

    if (userName) updateData.userName = userName
    if (email) updateData.email = email
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    if (Object.keys(updateData).length === 0) {
      return reply.code(400).send({ error: 'Nenhum dado fornecido para atualização' })
    }

    await knex('users').where({ id: userId }).update(updateData)

    return reply.code(200).send({ message: 'User updated successfully!' })
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
      return reply.code(400).send({ message: 'No files sent' })
    }

    // Limita tipos de arquivo
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(filePart.mimetype)) {
      return reply.status(400).send({ message: 'Unsupported file type' })
    }

    // Cria o diretório de upload se não existir
    const uploadDir = path.resolve(__dirname, '..', '..', 'uploads')
    if (!fs.existsSync(uploadDir))
      fs.mkdirSync(uploadDir,
        { recursive: true })

    // Gera nome único para o arquivo
    function sanitizeFilename(filename: string): string {
      // Extrai a extensão do arquivo
      const ext = filename.split('.').pop() || ''
      const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'))

      return (
        nameWithoutExt
          .normalize('NFD') // Normaliza caracteres Unicode
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/\s+/g, '_') // Substitui espaços por _
          .replace(/[^\w-]/g, '') // Remove caracteres especiais exceto _ e -
          .replace(/_+/g, '_') // Remove underscores repetidos
          .replace(/-+/g, '-') // Remove hífens repetidos
          .toLowerCase() // Converte para minúsculas
          .substring(0, 8) // Limita o tamanho
        + '.' + ext.toLowerCase() // Adiciona a extensão
      ).replace(/^_+|_+$/g, '') // Remove underscores no início/fim
    }


    const cleanFilename = sanitizeFilename(filePart.filename)
    // gera nome único
    const filename = `${Date.now()}-${cleanFilename}`
    const filepath = path.join(uploadDir, filename)

    // Cria stream de escrita e faz pipe do conteúdo
    const writeStream = fs.createWriteStream(filepath)
    await pipeline(filePart.file, writeStream)

    // Atualiza o usuário no banco
    await knex('users')
      .where({ id: (request.user as { sub: string }).sub })
      .update({ profilePicture: filename })

    return reply.code(200).send({ message: 'Photo updated successfully', filename, filepath })

  })


  app.delete('/delete', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = (request.user as { sub: string }).sub

    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' })
    }

    try {
      const userExists = await knex('users').where({ id: userId }).first()

      if (!userExists) {
        return reply.code(404).send({ error: 'User not found' })
      }

      await knex('users').where({ id: userId }).delete()

      return reply.code(200).send({ message: 'User deleted successfully' })
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      return reply.code(500).send({ error: 'Internal server error' })
    }
  })


}