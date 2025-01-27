import { db } from '@/db'
import { tokens, users } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { Elysia, t } from 'elysia'

export const confirmEmail = new Elysia().get(
    '/auth/confirmation/:token',
    async ({ params }) => {
        const { token } = params

        const userToken = await db.query.tokens.findFirst({
            where: eq(tokens.code, token),
        })

        if (!userToken?.userId) {
            throw new Error('Token not found')
        }

        if (userToken.tokenType !== 'register') {
            throw new Error('Invalid token type')
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, userToken?.userId),
        })

        if (!user) {
            throw new Error('User not found')
        }

        const validateToken = await db.query.tokens.findFirst({
            where: and(eq(tokens.userId, user.id), eq(tokens.code, token)),
        })

        if (!validateToken) {
            throw new Error('Invalid token')
        }

        await db
            .update(users)
            .set({
                status: 'payment_pending',
            })
            .where(eq(users.id, user.id))

        await db.delete(tokens).where(eq(tokens.userId, user.id))

        return {
            status: 200,
            message: 'Email confirmed successfully',
            redirectUrl: `${process.env.BASE_URL}/auth/payment?userId=${user.id}`,
        }
    },
    {
        params: t.Object({
            token: t.String(),
        }),
    }
)
