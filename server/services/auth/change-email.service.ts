import { eq } from 'drizzle-orm'

import type { EmailDTO } from '#shared/dto/email.dto'

import { throw404, throw500 } from '#imports'
import { emailUpdateResponseSchema } from '#server/dto/email.dto'

export async function changeEmail(userId: number, dto: EmailDTO) {
  const user = await db.query.users.findFirst({
    where: eq(tables.users.id, userId)
  })
  if (!user) return throw404('user not found')

  const [changedEmail] = await db
    .update(tables.users)
    .set({
      email: dto.email,
      updatedAt: new Date()
    })
    .where(eq(tables.users.id, userId))
    .returning()

  if (!changedEmail) throw500('Email could not be updated')

  return emailUpdateResponseSchema.parse(changedEmail)
}
