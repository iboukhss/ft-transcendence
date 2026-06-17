import { eq, and } from 'drizzle-orm'

import { db, tables } from '#server/utils/db'
import { jobSchema, type CreateJobDTO } from '#shared/dto/job.dto'

export async function createJob(userId: number, dto: CreateJobDTO) {
  const existingJob = await db.query.jobs.findFirst({
    where: and(eq(tables.jobs.userId, userId), eq(tables.jobs.title, dto.title))
  })

  if (existingJob) {
    throw createError({ statusCode: 409, statusMessage: 'Job title already exists' })
  }

  const [createdJob] = await db
    .insert(tables.jobs)
    .values({
      userId: userId,
      ...dto
    })
    .returning()

  if (!createdJob) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create job listing' })
  }

  return jobSchema.parse(createdJob)
}
