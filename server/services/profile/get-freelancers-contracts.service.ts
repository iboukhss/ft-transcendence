import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

import type { DB, Tables } from '#server/utils/db.js'

import { jobSchema } from '#shared/dto/job.dto.js'

const contractSchema = jobSchema.extend({
  companyName: z.string()
})

export type ContractDTO = z.infer<typeof contractSchema>

export async function getFreelancerContracts(db: DB, tables: Tables, userId: number): Promise<ContractDTO[]> {
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
      updatedAt: tables.jobs.updatedAt,
      companyName: tables.companyProfiles.companyName
    })
    .from(tables.jobs)
    .innerJoin(tables.offers, eq(tables.jobs.id, tables.offers.jobId))
    .innerJoin(tables.companyProfiles, eq(tables.jobs.userId, tables.companyProfiles.userId))
    .where(
      and(
        eq(tables.offers.sellerId, userId)
      )
    )
    .orderBy(tables.jobs.createdAt)

  return z.array(contractSchema).parse(jobs)
}
