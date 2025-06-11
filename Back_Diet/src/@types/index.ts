declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      password: string
      session_id?: string
      role:string,
      created_at: Date
    }
    meals: {
      id: string
      userId: string
      name: string
      description: string
      date: string
      time: string
      isDiet: string
      created_at: Date
    }
  }
}