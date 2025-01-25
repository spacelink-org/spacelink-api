import { db } from '@/db'
import { transactions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '../auth'
import Elysia from 'elysia'

export const getDebits = new Elysia()
    .use(auth)
    .get('/wallet/debits', async ({ getCurrentUser }) => {
        const { sub: userId } = await getCurrentUser()

        const debits = await db.query.transactions.findMany({
            where: eq(transactions.userId, userId),
        })

        return debits
    })
