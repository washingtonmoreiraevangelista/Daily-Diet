import { FastifyReply, FastifyRequest } from 'fastify'

// Apenas verifica se o token é válido
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ message: 'Token inválido' })
  }
}

// Verifica se é admin
export async function authorizeAdmin(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()

    console.log('Role do usuário autenticado:', request.user)

    if (request.user?.role !== 'Admin') {
      return reply.status(403).send({ message: 'Sem permissão de administrador.' })
    }
  } catch (err) {
    return reply.status(401).send({ message: 'Token inválido' })
  }
}


