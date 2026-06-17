import { eq, and } from 'drizzle-orm'

import type { User } from '#auth-utils'

import { db, tables } from '#server/utils/db'
import { offerSchema } from '#shared/dto/offer.dto.js'

export async function getOfferById(offerId: number, sessionUser: User) {
  const conditions = [eq(tables.offers.id, offerId)]

  if (sessionUser.role !== 'admin') {
    const ownerCondition = sessionUser.accountType === 'freelancer'
      ? eq(tables.offers.sellerId, sessionUser.id)
      : eq(tables.offers.buyerId, sessionUser.id)

    conditions.push(ownerCondition)
  }

  const offer = await db.query.offers.findFirst({
    where: and(...conditions)
  })

  if (!offer) {
    throw createError({ statusCode: 404, statusMessage: 'Offer not found' })
  }

  return offerSchema.parse(offer)
}
