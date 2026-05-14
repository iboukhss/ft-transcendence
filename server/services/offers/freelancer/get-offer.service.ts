import { eq, and } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

import { toOfferResponseDTO } from '#server/dto/offer.dto'

export async function getOffer(db: DB, tables: Tables, userId: number, jobId: number) {
  const offer = await db.query.offers.findFirst({
    where: and(
      eq(tables.offers.jobId, jobId),
      eq(tables.offers.sellerId, userId) // Sicherheits-Check: Nur das eigene Angebot laden
    )
  })

  if (!offer) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Das Angebot für diesen Job wurde nicht gefunden.'
    })
  }

  return toOfferResponseDTO(offer)
}
