import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'
//import { createNotification } from '#server/services/notifications/create-notification.service'
//import { sendNotificationEmail } from '#server/services/notifications/send-notification-email.service'

export async function updateUser(
  db: DB,
  tables: Tables,
  userId: number,
  adminId: number,
  dto: {
    email?: string
    accountType?: string
    // freelancer fields
    firstName?: string
    lastName?: string
    country?: string
    bio?: string
    skills?: string[]
    languages?: string[]
    hourlyRate?: number | null
    // company fields
    companyName?: string
    contactFirstName?: string
    contactLastName?: string
    website?: string | null
    description?: string | null
  }
) {
  const user = await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, userId))
    .then(rows => rows[0])

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  const { email, accountType, ...profileFields } = dto

  // Update user table if email changed
  if (email) {
    await db
      .update(tables.users)
      .set({ email, updatedAt: new Date() })
      .where(eq(tables.users.id, userId))
  }

  // Update profile table based on account type
  if (Object.keys(profileFields).length > 0) {
    if (user.accountType === 'freelancer') {
      await db
        .update(tables.freelancerProfiles)
        .set({ ...profileFields, updatedAt: new Date() })
        .where(eq(tables.freelancerProfiles.userId, userId))
    }
    else if (user.accountType === 'company') {
      await db
        .update(tables.companyProfiles)
        .set({ ...profileFields, updatedAt: new Date() })
        .where(eq(tables.companyProfiles.userId, userId))
    }
  }

  // Notify the user
/*  await createNotification(
    db,
    tables,
    userId,
    'Your account was updated by an administrator',
    'An administrator has made changes to your account or profile. Please log in to review.'
  )*/

  // Send email notification
/*  await sendNotificationEmail(
    user.email,
    'Your account was updated — LuxLink',
    'An administrator has made changes to your account or profile. Please log in to review the changes at luxlink.lu'
  )*/

  return { success: true }
}
