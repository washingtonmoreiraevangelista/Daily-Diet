declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      password: string
      session_id?: string
      role:string,
      created_at: string
    }
    meals: {
      id: string
      userId: string
      name: string
      description: string
      date: string
      time: string
      is_diet: boolean
      created_at: string
    }
  }
}