import { and, arrayOverlaps, count, desc, eq, ilike, inArray, gte, lte } from 'drizzle-orm'
import { z } from 'zod'

import { db, tables } from '#server/utils/db'
import { jobSchema, type JobDTO, type JobsQueryDTO } from '#shared/dto/job.dto'

interface PaginatedJobs {
  items: JobDTO[]
  total: number
}

// DOCS:
// https://orm.drizzle.team/docs/guides/conditional-filters-in-query
// https://orm.drizzle.team/docs/operators#arrayoverlaps

export async function getJobs(query: JobsQueryDTO): Promise<PaginatedJobs> {
  const page = query.page ?? 1
  const limit = query.limit ?? 10
  const offset = (page - 1) * limit

  const conditions = [
    query.companyId ? eq(tables.jobs.userId, query.companyId) : undefined,
    query.search ? ilike(tables.jobs.title, `%${query.search}%`) : undefined,

    query.minSalary ? gte(tables.jobs.hourlyRate, query.minSalary) : undefined,
    query.maxSalary ? lte(tables.jobs.hourlyRate, query.maxSalary) : undefined,

    query.categories?.length ? inArray(tables.jobs.category, query.categories) : undefined,
    query.locations?.length ? inArray(tables.jobs.location, query.locations) : undefined,
    query.workplaces?.length ? inArray(tables.jobs.workplace, query.workplaces) : undefined,

    query.skills?.length ? arrayOverlaps(tables.jobs.skills, query.skills) : undefined
  ]

  const whereClause = and(...conditions.filter(Boolean))

  const [jobs, [totalCount]] = await Promise.all([
    db.query.jobs.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [desc(tables.jobs.id)]
    }),

    db.select({ amount: count() }).from(tables.jobs).where(whereClause)
  ])

  return {
    items: z.array(jobSchema).parse(jobs),
    total: totalCount?.amount || 0
  }
}
