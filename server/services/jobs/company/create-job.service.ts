import { eq, and } from 'drizzle-orm'

import type { UserSession } from '#auth-utils'
import type { DB, Tables, Transaction } from '#server/utils/db'
import type { JobDTO } from '#shared/dto/job.dto'

import { toJobDTO } from '#server/dto/job.dto'

export async function createJob(db: DB, tables: Tables, session: UserSession, dto: JobDTO) {
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const userId = session.user.id

  const existingJob = await db.query.jobs.findFirst({
    where: and(eq(tables.jobs.userId, userId), eq(tables.jobs.title, dto.title))
  })

  if (existingJob) {
    throw createError({ statusCode: 409, message: 'Job already exists' })
  }

  const createdJob = await db.transaction(async (tx: Transaction) => {
    const rows = await tx
      .insert(tables.jobs)
      .values({
        userId: userId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        skills: dto.skills,
        hourlyRate: dto.hourlyRate,
        duration: dto.duration,
        workplace: dto.workplace,
        location: dto.location,
        status: dto.status
      })
      .returning()

    return rows[0]
  })

  if (!createdJob) {
    throw createError({
      statusCode: 500,
      message: 'Database failed to return the created job'
    })
  }

  return toJobDTO(createdJob)
}
