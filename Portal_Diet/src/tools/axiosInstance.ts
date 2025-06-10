import axios from 'axios'


const proxy = import.meta.env.VITE_USE_PROXY
const baseUrl = import.meta.env.VITE_PROJETO_BACK

const connectAxios = axios.create({
  baseURL: proxy === 'true' ? '/api' : baseUrl,
})

export async function environment(
  route: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  payload?: any
): Promise<any> {
  try {
    const token = localStorage.getItem('token')

    const config: any = {
      url: route,
      method: method,
      headers: {}, 
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (method === 'GET' && payload) {
      config.params = payload
    } else {
      config.data = payload
    }

    const response = await connectAxios.request(config)
    return response.data
  } catch (error) {
    console.error('Erro na requisição do seguro:', error)
    throw error
  }
}
