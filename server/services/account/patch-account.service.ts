import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'
import type { AccountDTO } from '#shared/dto/account.dto'

import { toAccountResponseDTO } from '#server/dto/account.dto'

export async function patchAccount(db: DB, tables: Tables, userId: number, dto: AccountDTO) {
  const [account] = await db
    .update(tables.profiles)
    .set({
      ...dto,
      updatedAt: new Date()
    })
    .where (eq(tables.profiles.userId, userId))
    .returning()

  if (!account) {
    throw createError({
      statusCode: 404,
      message: 'Profile not found'
    })
  }

  return toAccountResponseDTO(account)
}
