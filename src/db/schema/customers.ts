import { createId } from '@paralleldrive/cuid2'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const customerStatusEnum = pgEnum('customer_status', [
    'pending_validation',
    'pending_payment',
    'active',
    'blocked',
    'desactivated',
])

export const customers = pgTable('customers', {
    id: text('id')
        .$defaultFn(() => createId())
        .primaryKey(),
    userId: text('user_id').references(() => users.id, {
        onDelete: 'set null',
    }),
    customerStatus: customerStatusEnum('customer_status')
        .default('pending_validation')
        .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
