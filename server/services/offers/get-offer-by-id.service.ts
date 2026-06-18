import { eq, and } from 'drizzle-orm'

import type { User } from '#auth-utils'
import type { Transaction } from '#server/utils/db'

import { db, tables } from '#server/utils/db'
import { dashboardOfferSchema } from '#shared/dto/offer.dto'

export async function getOfferById(offerId: number, sessionUser: User, tx?: Transaction) {
  const client = tx ?? db

  const conditions = [eq(tables.offers.id, offerId)]

  if (sessionUser.role !== 'admin') {
    const ownerCondition = sessionUser.accountType === 'freelancer'
      ? eq(tables.offers.sellerId, sessionUser.id)
      : eq(tables.offers.buyerId, sessionUser.id)

    conditions.push(ownerCondition)
  }

  const offer = await client.query.offers.findFirst({
    where: and(...conditions),
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

  if (!offer) {
    throw createError({ statusCode: 404, statusMessage: 'Offer not found' })
  }

  return dashboardOfferSchema.parse(offer)
}
