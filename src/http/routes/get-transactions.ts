import Elysia from 'elysia'
import { db } from '../../db'
import { auth } from '../auth'

export const getTransactions = new Elysia()
    .use(auth)
    .get('/transactions/get-all', async ({ getCurrentUser }) => {
        const { sub: userId } = await getCurrentUser()

        const transactions = await db.query.transactions.findMany({
            where(fields, { eq }) {
                return eq(fields.userId, userId)
            },
        })

        return transactions
    })
