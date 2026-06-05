import { eq } from 'drizzle-orm'

import type { DB, Tables, Transaction } from '#server/utils/db'

import { sessionUserSchema } from '#shared/dto/user.dto.js'

type googleUserData = {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
}

async function registerUser(db: DB, tables: Tables, user: googleUserData) {
  return await db.transaction(async (tx: Transaction) => {
    const [newUser] = await tx
      .insert(tables.users)
      .values({
        email: user.email,
        password: '',
        accountType: 'freelancer',
        role: 'user'
      })
      .returning()

    if (!newUser) {
      throw createError({
        statusCode: 500,
        message: 'User creation failed'
      })
    }
    await tx.insert(tables.freelancerProfiles).values({
      userId: newUser.id,
      firstName: user.given_name ?? 'user',
      lastName: user.family_name ?? 'noname',
      country: 'fr',
      avatar: user.picture ?? ''
    })
    return sessionUserSchema.parse(newUser)
  })
}

async function userExists(db: DB, tables: Tables, user: googleUserData) {
  const existingUser = await db.query.users.findFirst({
    where: eq(tables.users.email, user.email)
  })
  return (existingUser)
}

export async function handleOauthUser(db: DB, tables: Tables, user: googleUserData) {
  const c_user = await userExists(db, tables, user)
  if (c_user) {
    return (sessionUserSchema.parse(c_user))
  }
  const res = await registerUser(db, tables, user)
  return (res)
}
