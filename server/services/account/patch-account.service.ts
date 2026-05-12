import { eq } from 'drizzle-orm'

import type { DB, Tables, Transaction } from '#server/utils/db'
import type { AccountDTO } from '#shared/dto/account.dto'

import { toAccountResponseDTO } from '#server/dto/account.dto'

export async function patchAccount(db: DB, tables: Tables, userId: number, dto: AccountDTO) {
  const { email, ...profileFields } = dto

  const updatedAccount = await db.transaction(async (tx: Transaction) => {
    const [updatedUser] = await tx
      .update(tables.users)
      .set({
        email,
        updatedAt: new Date()
      })
      .where(eq(tables.users.id, userId))
      .returning({ email: tables.users.email })
    if (!updatedUser) {
      throw createError ({
        statusCode: 404,
        message: 'Not found',
        statusMessage: 'User not found'
      })
    }

    const [updatedProfile] = await tx
      .update(tables.profiles)
      .set({
        ...profileFields,
        updatedAt: new Date()
      })
      .where(eq(tables.profiles.userId, userId))
      .returning({
        houseNumber: tables.profiles.houseNumber,
        street: tables.profiles.street,
        zip: tables.profiles.zip
      })
    if (!updatedProfile) {
      throw createError ({
        statusCode: 404,
        message: 'Not found',
        statusMessage: 'User not found'
      })
    }
    return {
      email: updatedUser.email,
      houseNumber: updatedProfile.houseNumber,
      street: updatedProfile.street,
      zip: updatedProfile.zip
    }
  })

  if (!updatedAccount) {
    throw createError({
      statusCode: 404,
      message: 'Not found',
      statusMessage: 'User/Profile not found'
    })
  }

  return toAccountResponseDTO(updatedAccount)
}
