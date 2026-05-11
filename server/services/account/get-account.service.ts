import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

import { toAccountResponseDTO } from '#server/dto/account.dto.js'

export async function getAccount(db: DB, tables: Tables, userId: number) {
  const account = await db.query.profiles.findFirst(
    {
      where:
        eq(
          tables.profiles.userId,
          userId
        )
    })

  if (!account) {
    throw createError({
      statusCode: 404,
      message: 'Profile not found'
    })
  }

  return toAccountResponseDTO(account)
}
