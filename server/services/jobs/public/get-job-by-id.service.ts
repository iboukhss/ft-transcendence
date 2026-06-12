import { eq } from 'drizzle-orm'

import type { JobDTO } from '#shared/dto/job.dto'

import { db, tables } from '#server/utils/db'
import { jobSchema } from '#shared/dto/job.dto'

export async function getJobById(jobId: number): Promise<JobDTO> {
  const job = await db.query.jobs.findFirst({
    where: eq(tables.jobs.id, jobId)
  })

  if (!job) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job not found'
    })
  }

  return jobSchema.parse(job)
}
