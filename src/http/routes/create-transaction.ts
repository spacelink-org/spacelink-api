import Elysia, { t } from 'elysia'
import { auth } from '../auth'
import { db } from '../../db'
import { transactions } from '../../db/schema'

export const createTransaction = new Elysia().use(auth).post(
    '/transactions/create',
    async ({ body, getCurrentUser }) => {
        const { amount, description } = body

        const user = await getCurrentUser()

        await db.insert(transactions).values({
            userId: user.sub,
            amount,
            description,
        })
    },
    {
        body: t.Object({
            amount: t.Number(),
            description: t.String(),
        }),
    }
)
