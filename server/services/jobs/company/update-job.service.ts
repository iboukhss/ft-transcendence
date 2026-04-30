import { eq, and } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'
import type { JobDTO } from '#shared/dto/job.dto.js'

import { toJobDTO } from '#server/dto/job.dto.js'

export async function updateJob(db: DB, tables: Tables, userId: number, jobId: number, dto: JobDTO) {
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
        eq(tables.jobs.userId, userId),
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
