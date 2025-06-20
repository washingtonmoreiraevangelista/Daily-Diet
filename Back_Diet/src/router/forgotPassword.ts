import { FastifyInstance } from 'fastify'
import { knex } from '../dataBase'
import { Resend } from 'resend'
import dotenv from "dotenv"
import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

export function forgotPasswordRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.post('/shipping', async (request, reply) => {
    // Extrai o e-mail enviado no corpo da requisição
    const { email } = request.body as { email: string }

    // Verifica se o e-mail foi fornecido; se não, retorna erro 400
    if (!email) {
      return reply.code(400).send({ error: 'Email is required' })
    }

    // Procura um usuário no banco de dados com o e-mail fornecido
    const user = await knex('users')
      .where({ email })
      .first()

    // Se o usuário não existir, retorna erro 404
    if (!user) {
      return reply.code(404).send({ error: 'User not found' })
    }

    // Gera um token aleatório (UUID) para a redefinição de senha
    const token = randomUUID()

    // Define o tempo de expiração do token (10 minutos)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Salva o token, ID do usuário e data de expiração na tabela `password_resets`
    await knex('password_resets').insert({
      userId: user.id,
      token,
      expires_at: expiresAt,
    })

    // Define a URL base do frontend (pode vir do .env ou padrão localhost)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

    // Monta o link completo para a página de redefinição de senha com o token
    const resetLink = `${frontendUrl}/reset-password?token=${token}`
    console.log(resetLink)
    try {
      // Envia um e-mail de redefinição de senha com o link gerado
      await resend.emails.send({
        from: 'Meu App <onboarding@resend.dev>', // remetente
        to: email, // destinatário (o usuário)
        subject: 'Redefinição de Senha',
        html: `<p>Olá,${user.userName}</p>
             <p>Para redefinir sua senha, clique no link abaixo:</p>
             <p><a href="${resetLink}">Redefinir Senha</a></p>
             <p>Este link expira em 10 minutos.</p>`
      })
    } catch (error) {
      // Se der erro ao enviar o e-mail, exibe no console e retorna erro 500
      console.error('Error sending email:', error)
      return reply.code(500).send({ error: 'Error sending reset email' })
    }

    // Se tudo correr bem, responde informando que o e-mail foi enviado
    return reply.send({ message: 'Reset email sent' })
  })


  app.post('/reset', async (request, reply) => {
    const { token, newPassword } = request.body as { token: string, newPassword: string }

    if (!token || !newPassword) {
      return reply.code(400).send({ message: 'Token and new password are required' })
    }

    console.log("Token recebido:", token)

    const reset = await knex('password_resets')
      .where({ token })
      .andWhere('expires_at', '>', new Date())
      .first()
      
    console.log("Reset encontrado:", reset)

    const allResets = await knex('password_resets').select()
    console.log('Todos os resets:', allResets)


    if (!reset) {
      return reply.code(400).send({ message: 'Invalid or expired token' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8)

    await knex('users')
      .where({ id: reset.userId })
      .update({ password: hashedPassword })

    await knex('password_resets')
      .where({ token })
      .del()

    return reply.send({ message: 'Password reset successfully' })
  })



}
