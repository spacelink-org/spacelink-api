import Elysia, { t } from 'elysia'
import { auth } from '../auth'
import { transactions, users } from '@/db/schema'
import { db } from '@/db'
import { and, eq } from 'drizzle-orm'

export const confirmCustomerPayment = new Elysia().use(auth).post(
    '/transactions/confirm-user-payment',
    async ({ body }) => {
        const { userId, transactionId, memberId } = body

        const member = await db.query.users.findFirst({
            where: eq(users.id, memberId),
        })

        if (!member) {
            return new Response('Member not found', { status: 404 })
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        })

        if (!user || user.status !== 'payment_pending') {
            return new Response(
                'User not found or not in payment pending status',
                { status: 404 }
            )
        }

        const transactionDetails = await db.query.transactions.findFirst({
            where: and(
                eq(transactions.id, transactionId),
                eq(transactions.userId, userId),
                eq(transactions.status, 'pending')
            ),
        })

        if (!transactionDetails) {
            return new Response('Transaction not found', { status: 404 })
        }

        const { amount } = transactionDetails

        const newBalance = user.wallet + amount

        await db
            .update(users)
            .set({ wallet: newBalance, status: 'active' })
            .where(eq(users.id, memberId))

        await db
            .update(transactions)
            .set({ status: 'done' })
            .where(eq(transactions.id, transactionId))

        return {
            status: 200,
            message: 'Payment confirmed successfully',
        }
    },
    {
        body: t.Object({
            userId: t.String(),
            transactionId: t.String(),
            memberId: t.String(),
        }),
    }
)
