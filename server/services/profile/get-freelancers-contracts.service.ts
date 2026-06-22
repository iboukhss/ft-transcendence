import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

import type { JobDTO } from '#shared/dto/job.dto.js'

import { jobSchema } from '#shared/dto/job.dto.js'

export async function getFreelancerContracts(db: DB, tables: Tables, userId: number): Promise<JobDTO[]> {
  const jobs = await db
    .select({
      id: tables.jobs.id,
      userId: tables.jobs.userId,
      title: tables.jobs.title,
      description: tables.jobs.description,
      category: tables.jobs.category,
      skills: tables.jobs.skills,
      hourlyRate: tables.jobs.hourlyRate,
      duration: tables.jobs.duration,
      workplace: tables.jobs.workplace,
      location: tables.jobs.location,
      status: tables.jobs.status,
      createdAt: tables.jobs.createdAt,
      updatedAt: tables.jobs.updatedAt
    })
    .from(tables.jobs)
    .innerJoin(tables.offers, eq(tables.jobs.id, tables.offers.jobId))
    .where(
      and(
        eq(tables.offers.sellerId, userId),
        eq(tables.offers.status, 'accepted')
      )
    )
    .orderBy(tables.jobs.createdAt) as unknown as JobDTO[]

  return z.array(jobSchema).parse(jobs)
}
