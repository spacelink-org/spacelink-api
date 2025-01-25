import { db } from '@/db'
import Elysia, { t } from 'elysia'

export const getUserDetails = new Elysia().get(
    '/users/details/:id',
    async ({ params }) => {
        const { id: userId } = params

        const userDetails = await db.query.users.findFirst({
            where(fields, { eq }) {
                return eq(fields.id, userId)
            },
        })

        if (!userDetails) {
            throw new Error('User not found')
        }

        return userDetails
    },
    {
        params: t.Object({
            id: t.String(),
        }),
    }
)
