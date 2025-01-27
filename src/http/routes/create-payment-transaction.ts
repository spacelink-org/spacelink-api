import { db } from '@/db'
import { transactions } from '@/db/schema'
import Elysia, { t } from 'elysia'

export const createPaymentTransaction = new Elysia().post(
    '/create-payment-transaction',
    async ({ body }) => {
        const { userId } = body

        const transaction = await db.insert(transactions).values({
            userId,
            status: 'pending',
            description: 'Pagamento de assinatura',
            type: 'credit',
            amount: 100,
            createdAt: new Date(),
        })

        return transaction
    },
    {
        body: t.Object({
            userId: t.String(),
        }),
    }
)
