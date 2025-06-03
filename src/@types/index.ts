import{ knex} from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      password: string
      session_id?: string
      created_at: string
    }
    meals: {
      id: string
      name: string
      description: string
      date: string
      time: string
      is_diet: string
      created_at: string
    }
  }
}