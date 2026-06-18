import { eq, and } from 'drizzle-orm'

import type { User } from '#auth-utils'
import type { OfferDTO, UpdateOfferDTO } from '#shared/dto/offer.dto'

import { db, tables } from '#server/utils/db'
import { offerSchema } from '#shared/dto/offer.dto'

export async function updateOffer(offerId: number, dto: UpdateOfferDTO, sessionUser: User): Promise<OfferDTO> {
  const existingOffer = await db.query.offers.findFirst({
    where: eq(tables.offers.id, offerId)
  })

  if (!existingOffer) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Application not found'
    })
  }

  if (existingOffer.sellerId !== sessionUser.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You are not authorized to modify this application'
    })
  }

  if (existingOffer.status !== 'pending') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot modify an application that has been processed already'
    })
  }

  const [updatedOffer] = await db
    .update(tables.offers)
    .set({
      motivationLetter: dto.motivationLetter,
      proposedHourlyRate: dto.proposedHourlyRate,
      updatedAt: new Date()
    }
    )
    .where(
      and(
        eq(tables.offers.id, offerId),
        eq(tables.offers.sellerId, sessionUser.id)
      )
    )
    .returning()

  if (!updatedOffer) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to write application modifications to the database'
    })
  }

  return offerSchema.parse(updatedOffer)
}
