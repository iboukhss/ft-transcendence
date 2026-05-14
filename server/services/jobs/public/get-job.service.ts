import { toJobDTO } from '#server/dto/job.dto.js'
import { eq } from 'drizzle-orm'

export async function getJobById(db: DB, tables: Tables, jobId: number) {
  const job = await db.query.jobs.findFirst({
    where: eq(tables.jobs.id, jobId)
  })

  if (!job) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job not found'
    })
  }

  return toJobDTO(job)
}
