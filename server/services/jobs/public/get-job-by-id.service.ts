import { eq } from 'drizzle-orm'

import { jobSchema } from '#shared/dto/job.dto.js'

export async function getJobById(jobId: number) {
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
