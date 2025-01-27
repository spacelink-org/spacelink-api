import { z } from 'zod'

export const envSchema = z.object({
    JWT_SECRET_KEY: z.string(),
    BASE_URL: z.string().url(),
    REDIRECT_URL: z.string().url(),
    DATABASE_URL: z.string().url().min(1),
    RESEND_API_KEY: z.string().min(1),
})

export const env = envSchema.parse(process.env)
