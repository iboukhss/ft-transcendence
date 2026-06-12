import { z } from 'zod'

import type { JobDTO } from '#shared/dto/job.dto'

import { db } from '#server/utils/db'
import { jobSchema } from '#shared/dto/job.dto'

export async function getJobsAll(): Promise<JobDTO[]> {
  const jobs = await db.query.jobs.findMany()

  return z.array(jobSchema).parse(jobs)
}
