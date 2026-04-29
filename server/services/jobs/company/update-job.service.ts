import { eq, and } from 'drizzle-orm'
import { success } from 'zod'

import type { UserSession } from '#auth-utils'
import type { DB, Tables } from '#server/utils/db'
import type { JobDTO } from '#shared/dto/job.dto.js'

import { toJobDTO } from '#server/dto/job.dto.js'

export async function updateJob(db: DB, tables: Tables, session: UserSession, jobId: number, dto: JobDTO) {
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const userId = session.user.id

  const [updatedJob] = await db
    .update(tables.jobs)
    .set({
      userId: userId,
      title: dto.title,
      description: dto.description,
      category: dto.category,
      skills: dto.skills,
      hourlyRate: dto.hourlyRate,
      duration: dto.duration,
      workplace: dto.workplace,
      location: dto.location,
      status: dto.status,
      updatedAt: new Date()
    })
    .where(
      and(
        eq(tables.jobs.userId, session.user.id),
        eq(tables.jobs.id, jobId)
      )
    )
    .returning()

  if (!updatedJob) {
    throw createError ({
      statusCode: 404,
      message: 'Job not found or missing permission to update it'
    })
  }
  return toJobDTO(updatedJob)
}
