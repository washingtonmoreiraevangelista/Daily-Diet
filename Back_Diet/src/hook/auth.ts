import { FastifyReply, FastifyRequest } from 'fastify'

// Apenas verifica se o token é válido
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (error) {
    return reply.status(401).send({ message: 'Invalid token' })
  }
}

// Verifica se é admin
export async function authorizeAdmin(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()

    console.log('Authenticated user role:', request.user?.role)

    if (request.user?.role !== 'Admin') {
      return reply.status(403).send({ message: 'Administrator permission required' })
    }
  } catch (error) {
    return reply.status(401).send({ message: 'Invalid token' })
  }
}


