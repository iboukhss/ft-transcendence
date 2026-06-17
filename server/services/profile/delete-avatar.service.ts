import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db.js'

export async function deleteAvatar(db: DB, tables: Tables, userId: number, userType: string) {
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

  const configMap = {
    company: {
      table: tables.companyProfiles,
      column: 'logo' as const,
      relation: tables.companyProfiles.userId
    },
    freelancer: {
      table: tables.freelancerProfiles,
      column: 'avatar' as const,
      relation: tables.freelancerProfiles.userId
    }
  }

  const activeConfig = configMap[userType as keyof typeof configMap]

  if (!activeConfig) throw createError({
    statusCode: 404,
    message: `Invalid account type: "${userType}"`,
    statusMessage: 'User not found'
  })

  const [currentProfile] = await db
    .select()
    .from(activeConfig.table)
    .where(eq(activeConfig.relation, userId))

  const filenameToDelete = currentProfile ? currentProfile[activeConfig.column] : null

  const [updatedProfile] = await db
    .update(activeConfig.table)
    .set({ [activeConfig.column]: null })
    .where(eq(activeConfig.relation, userId))
    .returning()

  console.log('Looking for User ID:', userId)
  console.log('Database Update Result:', updatedProfile)

  await useStorage('uploads').hasItem(filenameToDelete)
  if (filenameToDelete) {
    const cleanFilename = filenameToDelete.replace(/^\/?uploads\//, '')

    await useStorage('uploads').removeItem(cleanFilename)
  }

  return updatedProfile
}
