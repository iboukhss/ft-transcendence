import { eq, count, and, arrayContains, inArray, between } from 'drizzle-orm'
import { z } from 'zod'

import type { JobDTO } from '#shared/dto/job.dto'

import { db, tables } from '#server/utils/db'
import { jobSchema } from '#shared/dto/job.dto'

// DOCS: https://orm.drizzle.team/docs/guides/conditional-filters-in-query

type filter_data = {
  skills?: string[]
  location?: string[]
  categories?: string[]
  workplace?: string[]
  salaryStart?: number
  salaryEnd?: number
}

export async function getJobs(query_filter: filter_data, filters?: { userId?: number, page?: number }): Promise<JobDTO[]> {
  const data_limit = 10
  const jobs = await db.query.jobs.findMany({
    where: and(filters?.userId ? eq(tables.jobs.userId, filters.userId) : undefined,
      query_filter.workplace ? inArray(tables.jobs.workplace, query_filter.workplace) : undefined,
      query_filter.location ? inArray(tables.jobs.location, query_filter.location) : undefined,
      query_filter.skills ? arrayContains(tables.jobs.skills, query_filter.skills) : undefined,
      query_filter.categories ? inArray(tables.jobs.category, query_filter.categories) : undefined,
      (query_filter.salaryStart && query_filter.salaryEnd) ? between(tables.jobs.hourlyRate, query_filter.salaryStart, query_filter.salaryEnd) : undefined
    ),
    offset: filters?.page ? (filters.page - 1) * data_limit : 1,
    limit: data_limit
  })
  return z.array(jobSchema).parse(jobs)
}

export async function getJobsAmount(query_filter: filter_data) {
  const result = await db
    .select({ amount: count() })
    .from(tables.jobs)
    .where(
      and(
        query_filter.workplace ? inArray(tables.jobs.workplace, query_filter.workplace) : undefined,
        query_filter.location ? inArray(tables.jobs.location, query_filter.location) : undefined,
        query_filter.skills ? arrayContains(tables.jobs.skills, query_filter.skills) : undefined,
        query_filter.categories ? inArray(tables.jobs.category, query_filter.categories) : undefined,
        (query_filter.salaryStart && query_filter.salaryEnd) ? between(tables.jobs.hourlyRate, query_filter.salaryStart, query_filter.salaryEnd) : undefined
      ))
  return result[0]!.amount
}
