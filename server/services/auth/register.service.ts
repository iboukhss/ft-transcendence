import { eq } from 'drizzle-orm'

import type { DB, Tables, Transaction } from '#server/utils/db'
import type { RegisterDTO } from '#shared/dto/register.dto'

import { toSessionUserDTO } from '#server/dto/user.dto'

export async function registerUser(db: DB, tables: Tables, dto: RegisterDTO) {
  const existingUser = await db.query.users.findFirst({
    where: eq(tables.users.email, dto.email)
  })

  if (existingUser) {
    throw createError({ statusCode: 409, message: 'User already exists' })
  }

  const hashedPassword = await hashPassword(dto.password)

  return await db.transaction(async (tx: Transaction) => {
    // 1. Create auth user
    const result = await tx
      .insert(tables.users)
      .values({
        email: dto.email,
        password: hashedPassword,
        accountType: dto.accountType,
        role: 'user'
      })
      .returning()

    const user = result[0]

    if (!user) {
      throw createError({
        statusCode: 500,
        message: 'User creation failed'
      })
    }

    // 2. Create profile
    await tx.insert(tables.profiles).values({
      userId: user.id,

      firstName: dto.firstName,
      lastName: dto.lastName,

      houseNumber: dto.houseNumber,
      street: dto.street,
      zip: dto.zip,

      country: dto.country,
      language: dto.language
    })

    // 3. Return safe DTO
    return toSessionUserDTO(user)
  })
}
