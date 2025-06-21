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

  async getProfile() {
    try {
      const response = await environment('/profile/user', 'GET')
      return response
    } catch (error) {
      throw new Error('Erro ao buscar perfil')
    }
  },

  async updateProfile(data: IUser) {
    try {
      const response = await environment('/profile/update', 'PUT', data)
      return response
    } catch (error) {
      throw new Error('Erro ao atualizar perfil')
    }
  },

  async uploadProfilePicture(formData: FormData) {
    try {
      const response = await environment('/profile/avatar', 'POST', formData)
      return response
    } catch (error) {
      throw new Error('Erro ao fazer upload da imagem de perfil')
    }
  },

  getProfilePictureUrl(filename: string) {
    return `${import.meta.env.VITE_PROJETO_BACK}/uploads/${filename}`
  },

  async deleteProfile() {
    try {
      const response = await environment('/profile/delete', 'DELETE')
      return response
    } catch (error) {
      throw new Error('Erro ao deletar perfil')
    }
  },


}
