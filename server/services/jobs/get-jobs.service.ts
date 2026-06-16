import { eq } from 'drizzle-orm'
import { z } from 'zod'

import type { JobDTO } from '#shared/dto/job.dto'

import { db, tables } from '#server/utils/db'
import { jobSchema } from '#shared/dto/job.dto'

// DOCS: https://orm.drizzle.team/docs/guides/conditional-filters-in-query

export async function getJobs(filters?: { userId?: number }): Promise<JobDTO[]> {
  const jobs = await db.query.jobs.findMany({
    where: filters?.userId ? eq(tables.jobs.userId, filters.userId) : undefined
  })

  return z.array(jobSchema).parse(jobs)
}
