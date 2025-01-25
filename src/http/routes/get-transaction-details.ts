import Elysia, { t } from 'elysia'
import { db } from '../../db'
import { auth } from '../auth'

export const getTransactionDetails = new Elysia().use(auth).get(
    '/transactions/get-all/:id',
    async ({ getCurrentUser, query }) => {
        const { id: transactionId } = query
        const { sub: userId } = await getCurrentUser()

        const transactions = await db.query.transactions.findFirst({
            where(fields, { eq, and }) {
                return and(
                    eq(fields.userId, userId),
                    eq(fields.id, transactionId)
                )
            },
        })

        return transactions
    },
    {
        query: t.Object({
            id: t.String(),
        }),
    }
)
