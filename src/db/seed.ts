import { users } from './schema/users'
import { db } from '.'
import chalk from 'chalk'
import { faker } from '@faker-js/faker'
import * as bcrypt from 'bcrypt'

/**
 * Reset user table (TODO: refactor later)
 */

await db.delete(users)

console.log(chalk.yellow('Users tables successfully reseted'))

/**
 * Create user (TODO: refactor later)
 */

await db.insert(users).values([
    {
        name: faker.person.fullName(),
        email: 'admin@admin.com',
        role: 'administrator',
        phone: '00000000000',
        document: '00000000000',
        password: await bcrypt.hash('senha@123', 12),
    },
])

console.log(chalk.greenBright('User as created successfully!'))

/**
 * Exit process
 */

process.exit()
