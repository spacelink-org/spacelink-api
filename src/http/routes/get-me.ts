import Elysia from 'elysia'
import { auth } from '@/http/auth'
import { db } from '@/db'

export const getMe = new Elysia()
    .use(auth)
    .get('/users/get-me', async ({ getCurrentUser }) => {
        const { sub: userId } = await getCurrentUser()

        const user = db.query.users.findFirst({
            where(fields, { eq }) {
                return eq(fields.id, userId)
            },
        })

        if (!user) {
            throw new Error('User not found or unauthorized')
        }

        return user
    })
