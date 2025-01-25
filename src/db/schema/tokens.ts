import { createId } from '@paralleldrive/cuid2'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const tokenTypeEnum = pgEnum('token_type', [
    'auth',
    'register',
    'recovery',
    'validate',
    'reset_password',
    'other',
])

export const tokens = pgTable('tokens', {
    id: text('id')
        .$defaultFn(() => createId())
        .primaryKey(),
    code: text('code')
        .$defaultFn(() => createId())
        .unique(),
    userId: text('user_id').references(() => users.id, {
        onDelete: 'set null',
    }),
    tokenType: tokenTypeEnum('token_type').default('other').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAr: timestamp('updated_at').defaultNow().notNull(),
})
