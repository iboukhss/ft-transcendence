import { eq } from 'drizzle-orm'

import type { LoginDTO } from '#shared/dto/login.dto.js'

import { db, tables } from '#server/utils/db'
import { sessionUserSchema, type SessionUserDTO } from '#shared/dto/user.dto.js'

export async function loginUser(dto: LoginDTO): Promise<SessionUserDTO> {
  const user = await db.query.users.findFirst({
    where: eq(tables.users.email, dto.email)
  })

  if (!user) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const valid = await verifyPassword(user.password, dto.password)

  if (!valid) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  let sessionUserData: SessionUserDTO

  if (user.accountType === 'freelancer') {
    const profile = await db.query.freelancerProfiles.findFirst({
      where: eq(tables.freelancerProfiles.userId, user.id)
    })

    if (!profile) {
      throw createError({ statusCode: 404, message: 'Freelancer profile not found' })
    }

    sessionUserData = {
      id: user.id,
      email: user.email,
      role: user.role,
      accountType: 'freelancer',
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatarUrl: profile.avatar
    }
  }
  else {
    const profile = await db.query.companyProfiles.findFirst({
      where: eq(tables.companyProfiles.userId, user.id)
    })

    if (!profile) {
      throw createError({ statusCode: 404, message: 'Company profile not found' })
    }

    sessionUserData = {
      id: user.id,
      email: user.email,
      role: user.role,
      accountType: 'company',
      firstName: profile.contactFirstName,
      lastName: profile.contactLastName,
      avatarUrl: profile.logo
    }
  }

  return sessionUserSchema.parse(sessionUserData)
}
