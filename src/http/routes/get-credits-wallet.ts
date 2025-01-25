import { db } from '@/db'
import { transactions } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import Elysia from 'elysia'
import { auth } from '../auth'

export const getCreditsWallet = new Elysia()
    .use(auth)
    .get('/wallet/credits', async ({ getCurrentUser }) => {
        const { sub: userId } = await getCurrentUser()

        const credits = await db.query.transactions.findMany({
            where: and(
                eq(transactions.userId, userId),
                eq(transactions.type, 'credit')
            ),
        })

        return credits
    })
