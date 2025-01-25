import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Elysia from 'elysia'
import { auth } from '../auth'

export const getWalletBalance = new Elysia()
    .use(auth)
    .get('/wallet/balance', async ({ getCurrentUser }) => {
        const { sub: userId } = await getCurrentUser()

        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        })

        if (!user) {
            return new Response('User not found', { status: 404 })
        }

        const transactions = await db.query.transactions.findMany({
            where: eq(users.id, userId),
        })

        const balance = transactions.reduce((acc, transaction) => {
            return (
                acc +
                (transaction.type === 'credit'
                    ? transaction.amount
                    : -transaction.amount)
            )
        }, user.wallet)

        return {
            balance,
        }
    })
