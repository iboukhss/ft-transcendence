import { eq, count, and, or, arrayContains } from 'drizzle-orm'
import { z } from 'zod'

import type { JobDTO } from '#shared/dto/job.dto'

import { db, tables } from '#server/utils/db'
import { jobSchema } from '#shared/dto/job.dto'

// DOCS: https://orm.drizzle.team/docs/guides/conditional-filters-in-query

type filter_data = {
  skills?: string[]
  location?: string
  categories?: string[]
  workplace?: string
  salaryStart?: number
  salaryEnd?: number
}

export async function getJobs(query_filter: filter_data, filters?: { userId?: number, page?: number }): Promise<JobDTO[]> {
  const data_limit = 10
  const jobs = await db.query.jobs.findMany({
    where: filters?.userId ? eq(tables.jobs.userId, filters.userId) : undefined,
    offset: filters?.page ? (filters.page - 1) * data_limit : 1,
    limit: data_limit
  })

  return z.array(jobSchema).parse(jobs)
}

export async function getJobsAmount(query_filter: filter_data) {
  const result = await db
    .select({ amount: count() })
    .from(tables.jobs)
  return result[0]!.amount
}
