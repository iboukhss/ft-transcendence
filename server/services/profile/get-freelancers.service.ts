import { and, arrayOverlaps, count, desc, eq, ilike, inArray, or } from 'drizzle-orm'

import type { FreelancerDTO, FreelancersQueryDTO } from '#shared/dto/profile.dto.js'

import { freelancerProfileSchema } from '#shared/dto/profile.dto.js'

interface PaginatedFreelancers {
  items: FreelancerDTO[]
  total: number
}

export async function getFreelancerProfiles(query: FreelancersQueryDTO): Promise<PaginatedFreelancers> {
  const page = query.page ?? 1
  const limit = query.limit ?? 10
  const offset = (page - 1) * limit

  const conditions = [
    query.userId ? eq(tables.freelancerProfiles.userId, query.userId) : undefined,

    query.search
      ? or(
          ilike(tables.freelancerProfiles.firstName, `%${query.search}%`),
          ilike(tables.freelancerProfiles.lastName, `%${query.search}%`),
          ilike(tables.freelancerProfiles.bio, `%${query.search}%`)
        )
      : undefined,

    query.locations?.length ? inArray(tables.freelancerProfiles.country, query.locations) : undefined,
    query.skills?.length ? arrayOverlaps(tables.freelancerProfiles.skills, query.skills) : undefined
  ]

  const whereClause = and(...conditions.filter(Boolean))

  const [freelancers, [totalCount]] = await Promise.all([
    db.query.freelancerProfiles.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [desc(tables.freelancerProfiles.id)]
    }),

    db.select({ amount: count() }).from(tables.freelancerProfiles).where(whereClause)
  ])

  const items = freelancers.map((profileData) => {
    return freelancerProfileSchema.parse({
      type: 'freelancer',
      ...profileData
    })
  })

  return {
    items,
    total: totalCount?.amount || 0
  }
}
