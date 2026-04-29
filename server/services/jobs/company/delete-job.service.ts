import { eq, and } from 'drizzle-orm'

import type { UserSession } from '#auth-utils'
import type { DB, Tables } from '#server/utils/db'

export async function deleteJob(db: DB, tables: Tables, session: UserSession, jobId: number) {
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const userId = session.user.id

  const deletedJob = await db
    .delete(tables.jobs)
    .where(
      and(
        eq(tables.jobs.id, jobId),
        eq(tables.jobs.userId, userId)
      )
    )
    .returning({ id: tables.jobs.id })

  if (deletedJob.length === 0) {
    throw createError ({
      statusCode: 404,
      message: 'Job not found or missing permission to delete it'
    })
  }

  return { success: true }
}
