import { createId } from '@paralleldrive/cuid2'
import { real, pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'
import { relations } from 'drizzle-orm'

export const transactionStatusEnum = pgEnum('transaction_status', [
    'pending',
    'error',
    'done',
    'review',
])

export const transactionTypeEnum = pgEnum('transaction_type', [
    'credit',
    'debit',
    'refund',
])

export const transactions = pgTable('transactions', {
    id: text('id')
        .$defaultFn(() => createId())
        .primaryKey(),
    description: text('description').notNull(),
    amount: real('amount').notNull().default(0),
    userId: text('user_id').references(() => users.id, {
        onDelete: 'set null',
    }),
    status: transactionStatusEnum('status').default('pending').notNull(),
    type: transactionTypeEnum('type').default('credit').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
})

export const transactionsRelations = relations(transactions, ({ one }) => {
    return {
        user: one(users, {
            fields: [transactions.userId],
            references: [users.id],
            relationName: 'transaction_user',
        }),
    }
})
