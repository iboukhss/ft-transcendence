import { count } from 'drizzle-orm'
import { z } from 'zod'

import type { JobDTO } from '#shared/dto/job.dto'

import { db } from '#server/utils/db'
import { jobSchema } from '#shared/dto/job.dto'

export async function getJobsAll(page: number): Promise<JobDTO[]> {
  const data_limit: number = 10
  const jobs = await db.query.jobs.findMany({
    offset: (page - 1) * data_limit,
    limit: data_limit
  })
  return z.array(jobSchema).parse(jobs)
}

export async function getJobsAmount(): Promise<number> {
  const [res] = await db
    .select({ count: count() })
    .from(tables.jobs)
  return res!.count
}
