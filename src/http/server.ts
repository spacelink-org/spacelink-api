import { Elysia } from 'elysia'
import swagger from '@elysiajs/swagger'
import cors from '@elysiajs/cors'
import { auth } from './auth'
import { signIn } from './routes/sign-in'
import { signOut } from './routes/sign-out'
import { getCustomers } from './routes/get-customers'
import { getMe } from './routes/get-me'
import { getTransactions } from './routes/get-transactions'
import { getTransactionDetails } from './routes/get-transaction-details'
import { createCustomer } from './routes/create-customer'
import { createTransaction } from './routes/create-transaction'
import { getCustomerDetails } from './routes/get-customers-details'
import { deleteUser } from './routes/delete-customer'
import { updateUser } from './routes/update-user'
import { getWalletBalance } from './routes/get-wallet-balance'
import { getCreditsWallet } from './routes/get-credits-wallet'
import { getDebits } from './routes/get-debits'
import { signUp } from './routes/sign-up'
import { confirmEmail } from './routes/confirm-email'
import { confirmPayment } from './routes/confirm-payment'
import { createPaymentTransaction } from './routes/create-payment-transaction'
import { createTransferKey } from './routes/create-transfer-key'
import { deleteTransferKey } from './routes/delete-transfer-key'
import { getTransferKeys } from './routes/get-transfers-keys'
import { confirmCustomerPayment } from './routes/confirm-customer-payment'
import { sendPasswordRecoveryEmail } from './routes/send-password-recovery-email'
import { resetUserPassword } from './routes/reset-user-password'

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
    .use(signIn)
    .use(signOut)
    .use(getCustomers)
    .use(getMe)
    .use(getTransactions)
    .use(getTransactionDetails)
    .use(createCustomer)
    .use(createTransaction)
    .use(getCustomerDetails)
    .use(deleteUser)
    .use(updateUser)
    .use(getWalletBalance)
    .use(getCreditsWallet)
    .use(getDebits)
    .use(signUp)
    .use(confirmEmail)
    .use(confirmPayment)
    .use(createPaymentTransaction)
    .use(createTransferKey)
    .use(deleteTransferKey)
    .use(getTransferKeys)
    .use(confirmCustomerPayment)
    .use(sendPasswordRecoveryEmail)
    .use(resetUserPassword)
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
