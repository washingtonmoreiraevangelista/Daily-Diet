import { environment } from '../tools/axiosInstance'

export const forgotPassword = {

async postForgotPassword(email: string) {
  try {
    const response = await environment('/forgot-password/shipping', 'POST', { email })
    return response
  } catch (error) {
    throw new Error('Erro ao enviar o email de recuperação de senha')
  }
}, 

async postResetPassword(token: string, newPassword: string) {
  try {
    const response = await environment(`/forgot-password/reset`, 'POST', {token, newPassword })
    console.log(response)
    return response
  } catch (error) {
    throw new Error('Erro ao redefinir a senha')
  }
}

}