import { authContract } from './contracts/auth'
import { createClient } from 'zodsei'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.DEV ? '' : import.meta.env.VITE_BASE_URL}/app/api`,
})

export const api = createClient(
  {
    auth: authContract,
  },
  {
    axios: axiosInstance,
    middleware: [
      async (ctx, next) => {
        const token = localStorage.getItem('token')
        ctx.headers['Authorization'] = `Bearer ${token}`
        const res = await next(ctx)
        const data = res.data as { code: number; message: string; data: unknown }
        if (data.code !== 200) {
          throw new Error(data.message)
        }
        return res
      },
    ],
  },
)
