import fastify from 'fastify'

export const app = fastify()

app.get('/hello', async () => {
  return('ola mundo')
})



