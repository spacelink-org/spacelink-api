import Elysia from 'elysia'
import { db } from '@/db'
import { auth } from '../auth'

export const getCustomers = new Elysia()
    .use(auth)
    .get('/customers', async ({ getCurrentUser }) => {
        const { sub: userId } = await getCurrentUser()

        const result = db.query.users.findMany({
            where(fields, { eq, and }) {
                return and(
                    eq(fields.role, 'customer'),
                    eq(fields.memberId, userId)
                )
            },
        })

        return result
    })
