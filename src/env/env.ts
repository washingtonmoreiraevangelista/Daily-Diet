import dotenv from 'dotenv'
import { z } from 'zod'


dotenv.config()

export const env = {
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: process.env.DATABASE_URL || '',
  DATABASE_CLIENT: process.env.DATABASE_CLIENT || 'sqlite',
  PORT: Number(process.env.PORT) || 8000,
}

