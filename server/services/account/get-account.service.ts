import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

import { toAccountResponseDTO } from '#server/dto/account.dto.js'
import { accountSchema } from '#shared/dto/account.dto.js'

export async function getAccount(db: DB, tables: Tables, userId: number) {
  const [account] = await db
    .select({
      email: tables.users.email, // from users table
      houseNumber: tables.profiles.houseNumber, // from profiles table
      street: tables.profiles.street,
      zip: tables.profiles.zip
    })
    .from(tables.users)
    .leftJoin(tables.profiles, eq(tables.users.id, tables.profiles.userId))
    .where(eq(tables.users.id, userId))

  if (!account) {
    throw createError({
      statusCode: 404,
      message: 'Profile not found'
    })
  }

  const validatedAccount = accountSchema.parse(account)

  return toAccountResponseDTO(validatedAccount)
}
