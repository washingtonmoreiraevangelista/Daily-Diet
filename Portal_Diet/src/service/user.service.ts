import { environment } from '../tools/axiosInstance'

export const authService = {
  // Registrar um novo usuário
  async register(data: any) {
    try {
      const response = await environment('/auth/register', 'POST', data)
      return response
    } catch (error) {
      throw new Error('Erro ao registrar o usuário')
    }
  },

  // Login de usuário
  async login(data: any) {
    try {
      const response = await environment('/users/login', 'POST', data)
      return response
    } catch (error) {
      throw new Error('Erro ao fazer login')
    }
  },

 
}
