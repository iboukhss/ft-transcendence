import { eq, and } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db.js'

import { offerResponseSchema } from '#server/dto/offer.dto.js'
import { throw400, throw403, throw404 } from '#server/utils/throwError.js'

export async function acceptOffer(
  db: DB,
  tables: Tables,
  offerId: number,
  userId: number,
  accountType: 'freelancer' | 'company' | 'admin'
) {
  let accountTypeFilter: any = undefined

  if (accountType === 'freelancer') {
    accountTypeFilter = eq(tables.offers.sellerId, userId)
  }
  else if (accountType === 'company') {
    accountTypeFilter = eq(tables.offers.buyerId, userId)
  }
  else if (accountType === 'admin') {
    accountTypeFilter = undefined
  }
  else {
    throw403('Invalid accountType')
  }

  const finalOffer = await db.transaction(async (tx) => {
    // check if the current offer has not already been accepted/rejected
    const currentOffer = await tx.query.offers.findFirst({
      where: eq(tables.offers.id, offerId)
    })

    if (!currentOffer) return throw404('Offer not found')

    if (accountType === 'freelancer' && currentOffer.sellerAgreed) return throw400('You already agreed to this offer')

    if (accountType === 'company' && currentOffer.buyerAgreed) return throw400('You already agreed to this offer')

    if (currentOffer.status !== 'pending') return throw400('Offer no longer pending')

    // prepare timestamp payload for the update
    const updatePayload: any = { updatedAt: new Date() }

    if (accountType === 'freelancer') updatePayload.sellerAgreed = new Date()
    else if (accountType === 'company') updatePayload.buyerAgreed = new Date()
    else throw403('Admin cannot accept on behalf')

    // update current offer
    const [offer] = await tx
      .update(tables.offers)
      .set(updatePayload)
      .where(
        accountTypeFilter
          ? and(eq(tables.offers.id, offerId), accountTypeFilter)
          : eq(tables.offers.id, offerId)
      )
      .returning()

    if (!offer) return throw404('Offer not found')

    if (offer.sellerAgreed && offer.buyerAgreed) {
      // I. Job-Daten abrufen für den Vergleich
      const job = await tx.query.jobs.findFirst({
        where: eq(tables.jobs.id, offer.jobId)
      })
      if (!job) return throw404('Original job not found')

      const finalHourlyRate = offer.proposedHourlyRate ?? job.hourlyRate
      const finalDuration = offer.proposedDuration ?? job.duration
      const finalWorkplace = offer.proposedWorkplace ?? job.workplace
      const finalPrice = finalHourlyRate * finalDuration

      await tx.insert(tables.bookings).values({
        offerId: offer.id,
        jobId: offer.jobId,
        buyerId: offer.buyerId,
        sellerId: offer.sellerId,
        hourlyRate: finalHourlyRate,
        duration: finalDuration,
        workplace: finalWorkplace,
        price: finalPrice,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      await tx.update(tables.offers).set({ status: 'accepted' }).where(eq(tables.offers.id, offerId))
      await tx.update(tables.jobs).set({ status: 'booked' }).where(eq(tables.jobs.id, offer.jobId))

      offer.status = 'accepted'
    }
    return offer
  })

  return offerResponseSchema.parse(finalOffer)
}
