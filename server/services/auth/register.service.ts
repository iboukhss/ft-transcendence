import { eq } from 'drizzle-orm'

import type { Transaction } from '#server/utils/db'
import type { RegisterDTO } from '#shared/dto/register.dto'
import type { SessionUserDTO } from '#shared/dto/user.dto'

import { db, tables } from '#server/utils/db'
import { sessionUserSchema } from '#shared/dto/user.dto'

export async function registerUser(dto: RegisterDTO): Promise<SessionUserDTO> {
  const existingUser = await db.query.users.findFirst({
    where: eq(tables.users.email, dto.email)
  })

  if (existingUser) {
    throw createError({ statusCode: 409, message: 'User already exists' })
  }

  const hashedPassword = await hashPassword(dto.password)

  return await db.transaction(async (tx: Transaction) => {
    const [newUser] = await tx
      .insert(tables.users)
      .values({
        email: dto.email,
        password: hashedPassword,
        accountType: dto.accountType,
        role: 'user'
      })
      .returning()

    if (!newUser) {
      throw createError({ statusCode: 500, message: 'User creation failed' })
    }

    let sessionUserData: SessionUserDTO

    if (dto.accountType === 'freelancer') {
      await tx.insert(tables.freelancerProfiles).values({
        userId: newUser.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        country: dto.country
      })

      sessionUserData = {
        id: newUser.id,
        email: dto.email,
        role: 'user',
        accountType: 'freelancer',
        firstName: dto.firstName,
        lastName: dto.lastName,
        avatarUrl: null
      }
    }
    else {
      await tx.insert(tables.companyProfiles).values({
        userId: newUser.id,
        contactFirstName: dto.contactFirstName,
        contactLastName: dto.contactLastName,
        companyName: dto.companyName,
        country: dto.country
      })

      sessionUserData = {
        id: newUser.id,
        email: dto.email,
        role: 'user',
        accountType: 'company',
        firstName: dto.contactFirstName,
        lastName: dto.contactLastName,
        avatarUrl: null
      }
    }

    return sessionUserSchema.parse(sessionUserData)
  })
}
