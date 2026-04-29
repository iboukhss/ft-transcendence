import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

import { toJobsResponseDTO } from '#server/dto/job.dto.js'

export async function getJobs(db: DB, tables: Tables, userId: number) {
  const jobs = await db.query.jobs.findMany({
    where:
        eq(
          tables.jobs.userId,
          userId
        )
  })

  if (jobs.length === 0) { // @Iboukhss: do you want me throwing an error or returning an empty response ?
    return []
  }

  return toJobsResponseDTO(jobs)
}
