import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'

import type { User } from '#auth-utils'
import type { DashboardOfferDTO } from '#shared/dto/offer.dto'

import { db, tables } from '#server/utils/db'
import { dashboardOfferSchema } from '#shared/dto/offer.dto'

export async function getOffers(userId: number, sessionUser: User): Promise<DashboardOfferDTO[]> {
  const isFreelancer = sessionUser.accountType === 'freelancer'

  const condition = isFreelancer
    ? eq(tables.offers.sellerId, userId)
    : eq(tables.offers.buyerId, userId)

  const offers = await db.query.offers.findMany({
    where: condition,
    orderBy: [desc(tables.offers.createdAt)],
    with: {
      job: {
        columns: {
          title: true,
          workplace: true,
          duration: true
        }
      },
      seller: {
        columns: {
          firstName: true,
          lastName: true
        }
      }
    }
  })

  return z.array(dashboardOfferSchema).parse(offers)
}
