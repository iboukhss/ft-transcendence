import { eq, and } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

import { toJobDTO } from '#server/dto/job.dto.js'
import { throw404 } from '#server/utils/throwError'

export async function getJobById(db: DB, tables: Tables, userId: number, jobId: number) {
  const [job] = await db
    .select()
    .from(tables.jobs)
    .where(
      and(
        eq(
          tables.jobs.userId,
          userId
        ),
        eq(tables.jobs.id, jobId)
      )
    )

  if (!job) {
    return throw404('Job could not be retrieved')
  }

  return toJobDTO(job)
}
