import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'
import type { EmailDTO } from '#shared/dto/email.dto'

import { toEmailDTO } from '#server/dto/email.dto'

export async function changeEmail(db: DB, tables: Tables, userId: number, dto: EmailDTO) {
  // check that oldPassword hash matches db
  const user = await db.query.users.findFirst({
    where: eq(tables.users.id, userId)
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'Not found',
      statusMessage: 'User not found'
    })
  }

  const [changedEmail] = await db
    .update(tables.users)
    .set({
      ...dto,
      updatedAt: new Date()
    })
    .where(eq(tables.users.id, userId))
    .returning()

  if (!changedEmail) {
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
      statusMessage: 'Update failed'
    })
  }
  return toEmailDTO(changedEmail)
}
