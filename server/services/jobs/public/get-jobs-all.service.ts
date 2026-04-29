
import { toJobsResponseDTO } from '#server/dto/job.dto.js'
import type { DB, Tables } from '#server/utils/db'

export async function getJobsAll(db : DB, tables: Tables) {
  const jobs = await db.query.jobs.findMany()

  if (jobs.length === 0) { // @Iboukhss: do you want me throwing an error or returning an empty response ?
    return []
  }

  return toJobsResponseDTO(jobs)
}
