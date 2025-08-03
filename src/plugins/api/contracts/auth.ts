import { defineContract } from 'zodsei'
import { z } from 'zod'

export const authContract = defineContract({
  login: {
    method: 'post',
    path: '/login',
    request: z.object({
      email: z.email(),
      password: z.string().min(6),
    }),
    response: z.object({
      token: z.string(),
    }),
  },
})
