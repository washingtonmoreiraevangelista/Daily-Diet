import type { IUser } from '../@types'
import { environment } from '../tools/axiosInstance'

export const authService = {
  
  // Registrar um novo usuário
  async register(data: IUser) {
    try {
      const response = await environment('/users/register', 'POST', data)
      return response
    } catch (error) {
      throw new Error('Erro ao registrar o usuário')
    }
  },

  // Login de usuário
  async login(data: IUser) {
    try {
      const response = await environment('/users/login', 'POST', data)
      return response
    } catch (error) {
      throw new Error('Erro ao fazer login')
    }
  },

 
}
