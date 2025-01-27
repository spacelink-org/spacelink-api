import { db } from '@/db'
import { transactions, users } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { Elysia, t } from 'elysia'

export const confirmPayment = new Elysia().post(
    '/confirm-payment',
    async ({ body }) => {
        const { userId, transactionId, response } = body

        if (!response) {
            throw new Error('Invalid response')
        }

        const transaction = await db.query.transactions.findFirst({
            where: and(
                eq(transactions.id, transactionId),
                eq(transactions.userId, userId)
            ),
        })

        if (!transaction) {
            throw new Error('Transaction not found')
        }

        if (transaction.status !== 'pending') {
            throw new Error('Transaction already confirmed')
        }

        await db
            .update(transactions)
            .set({
                status: 'done',
            })
            .where(eq(transactions.id, transactionId))

        await db
            .update(users)
            .set({
                status: 'active',
            })
            .where(eq(users.id, userId))

        return {
            status: 200,
            message: 'Transaction confirmed successfully',
        }
    },
    {
        body: t.Object({
            userId: t.String(),
            transactionId: t.String(),
            response: t.Boolean(),
        }),
    }
)
