import type { Meals } from '../@types'
import { environment } from '../tools/axiosInstance'

export const mealsService = {

  async createDiet(data: Meals) {
    try {
      const response = await environment('/meals/register', 'POST', data)
      return response
    } catch (error) {
      throw new Error('Erro ao criar a dieta')
    }
  },

  async getAllMeals() {
    try {
      const response = await environment('/meals/all', 'GET')
      return response
    } catch (error) {
      console.error('Erro ao buscar a dieta:', error)
      throw new Error('Erro ao buscar a dieta do usuário')
    }
  }

}