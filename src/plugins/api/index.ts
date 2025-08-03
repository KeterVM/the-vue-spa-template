import { authContract } from './contracts/auth'
import { createClient } from 'zodsei'

export const api = createClient(
  {
    auth: authContract,
  },
  {
    baseUrl: `${import.meta.env.DEV ? '' : import.meta.env.VITE_BASE_URL}/app/api`,
    adapter: 'axios',
    headers: {
      'Content-Type': 'application/json',
    },
    adapterConfig: {},
    middleware: [
      async (ctx, next) => {
        const token = localStorage.getItem('token')
        ctx.headers['Authorization'] = `Bearer ${token}`
        const res = await next(ctx)
        if (res.data.code !== 200) {
          throw new Error(res.data.message)
        }
        return res.data.data
      },
    ],
  },
)
