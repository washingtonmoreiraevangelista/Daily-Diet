import { FastifyInstance } from 'fastify'
import { knex } from '../dataBase'
import { Resend } from 'resend'
import dotenv from "dotenv"
import crypto from 'crypto'
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
    const token = crypto.randomUUID()

    // Define o tempo de expiração do token (1 hora a partir de agora)
    const expiresAt = new Date(Date.now() + 3600000) // 3600000ms = 1h

    // Salva o token, ID do usuário e data de expiração na tabela `passwordReset`
    await knex('passwordReset').insert({
      userId: user.id,
      token,
      expires_at: expiresAt,
    })

    // Define a URL base do frontend (pode vir do .env ou padrão localhost)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173/reset-password/:token'

    // Monta o link completo para a página de redefinição de senha com o token
    const resetLink = `${frontendUrl}/reset-password?token=${token}`

    try {
      // Envia um e-mail de redefinição de senha com o link gerado
      await resend.emails.send({
        from: 'Meu App <onboarding@resend.dev>', // remetente
        to: email, // destinatário (o usuário)
        subject: 'Redefinição de Senha',
        html: `<p>Olá,</p>
             <p>Para redefinir sua senha, clique no link abaixo:</p>
             <p><a href="${resetLink}">Redefinir Senha</a></p>
             <p>Este link expira em 1 hora.</p>`
      })
    } catch (error) {
      // Se der erro ao enviar o e-mail, exibe no console e retorna erro 500
      console.error('Erro ao enviar e-mail:', error)
      return reply.code(500).send({ error: 'Erro ao enviar e-mail de redefinição' })
    }

    // Se tudo correr bem, responde informando que o e-mail foi enviado
    return reply.send({ message: 'E-mail de redefinição enviado' })
  })


  app.post('/reset', async (request, reply) => {
 // Extrai o token e a nova senha enviados no corpo da requisição
  const { token, newPassword } = request.body as { token: string, newPassword: string }

  // Busca o registro de reset no banco pelo token e verifica se ele ainda é válido (não expirado)
  const reset = await knex('passwordReset')
    .where({ token })
    .andWhere('expires_at', '>', new Date()) // token ainda está válido (não expirou)
    .first()

  // Se o token não for encontrado ou estiver expirado, retorna erro 400
  if (!reset) {
    return reply.code(400).send({ message: 'Token inválido ou expirado' })
  }

  // Criptografa a nova senha usando bcrypt (8 rounds de salt)
  const hashedPassword = await bcrypt.hash(newPassword, 8)

  // Atualiza a senha do usuário no banco, procurando pelo e-mail registrado no reset
  await knex('users')
    .where({ id: reset.userId }) 
    .update({ password: hashedPassword })

  // Remove o token usado da tabela para impedir reutilização
  await knex('passwordReset')
    .where({ token })
    .del()

  // Retorna mensagem de sucesso ao cliente
  return reply.send({ message: 'Senha redefinida com sucesso' })
})


}
