import { Elysia } from 'elysia'
import swagger from '@elysiajs/swagger'
import cors from '@elysiajs/cors'
import { auth } from './auth'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { authenticateWithPassword } from './routes/authenticate-with-password'
import { signOut } from './routes/sign-out'
import { getUsers } from './routes/get-users'
import { getMe } from './routes/get-me'
import { getTransactions } from './routes/get-transactions'
import { getTransactionDetails } from './routes/get-transaction-details'
import { createUser } from './routes/create-user'
import { createTransaction } from './routes/create-transaction'
import { sendAuthLink } from './routes/send-auth-link'
import { getUserDetails } from './routes/get-user-details'
import { deleteUser } from './routes/delete-user'
import { updateUser } from './routes/update-user'
import { getWalletBalance } from './routes/get-wallet-balance'
import { getCreditsWallet } from './routes/get-credits-wallet'
import { getDebits } from './routes/get-debits'

const app = new Elysia()
    .use(
        cors({
            credentials: true,
            allowedHeaders: ['content-type'],
            methods: [
                'GET',
                'POST',
                'PUT',
                'DELETE',
                'PATCH',
                'HEAD',
                'OPTIONS',
            ],
            origin: (request): boolean => {
                const origin = request.headers.get('origin')

                if (!origin) {
                    return false
                }

                return true
            },
        })
    )
    .use(swagger())
    .use(auth)
    .use(authenticateFromLink)
    .use(authenticateWithPassword)
    .use(signOut)
    .use(getUsers)
    .use(getMe)
    .use(getTransactions)
    .use(getTransactionDetails)
    .use(createUser)
    .use(createTransaction)
    .use(sendAuthLink)
    .use(getUserDetails)
    .use(deleteUser)
    .use(updateUser)
    .use(getWalletBalance)
    .use(getCreditsWallet)
    .use(getDebits)
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'VALIDATION': {
                set.status = error.status

                return error.toResponse()
            }
            case 'NOT_FOUND': {
                return new Response(null, { status: 404 })
            }
            default: {
                console.error(error)

                return new Response(null, { status: 500 })
            }
        }
    })

app.listen(3333)

console.log(
    `🚀 Spacelink API is running at ${app.server?.hostname}:${app.server?.port}`
)
