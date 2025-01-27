import { db } from '@/db'
import Elysia, { t } from 'elysia'
import { auth } from '../auth'
import { eq } from 'drizzle-orm'
import { users } from '@/db/schema'

export const getCustomerDetails = new Elysia().use(auth).get(
    '/customers/:id',
    async ({ params, getCurrentUser }) => {
        const { id: userId } = params
        const { sub: currentUserId } = await getCurrentUser()

        const userFather = await db.query.users.findFirst({
            where: eq(users.id, currentUserId),
        })

        if (!userFather) {
            throw new Error('Unauthorized')
        }

        const userDetails = await db.query.users.findFirst({
            where(fields, { eq, and }) {
                return and(
                    eq(fields.id, userId),
                    eq(fields.memberId, userFather.id)
                )
            },
        })

        if (!userDetails) {
            throw new Error('User not found or unauthorized')
        }

        return userDetails
    },
    {
        params: t.Object({
            id: t.String(),
        }),
    }
)
