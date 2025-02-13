import Elysia, { t } from 'elysia'
import { db } from '../../db'
import { tokens, users } from '@/db/schema'
import * as bcrypt from 'bcrypt'
import { eq } from '@/drizzle-orm'

export const resetUserPassword = new Elysia().post(
    '/recovery/reset-user-password',
    async ({ body }) => {
        const { token, password, confirmPassword } = body

        const tokenCode = await db.query.tokens.findFirst({
            where(fields, { eq }) {
                return eq(fields.code, token)
            },
        })

        if (!tokenCode) {
            throw new Error('Token not exists!')
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match!')
        }

        const newPassword = await bcrypt.hash(password, 12)

        await db.update(users).set({
            password: newPassword,
        })

        await db.delete(tokens).where(eq(tokens.code, token))

        return console.log('Password successfully changed!')
    },
    {
        body: t.Object({
            token: t.String(),
            password: t.String(),
            confirmPassword: t.String(),
        }),
    }
)
