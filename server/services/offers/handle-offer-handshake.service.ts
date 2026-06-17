import { eq } from 'drizzle-orm'

import type { User } from '#auth-utils'

import { getOfferById } from '#server/services/offers/get-offer-by-id.service'
import { db, tables } from '#server/utils/db'
import { offerSchema, type OfferDTO } from '#shared/dto/offer.dto'

export async function handleOfferHandshake(
  offerId: number,
  action: 'accept' | 'decline',
  sessionUser: User
): Promise<OfferDTO> {
  if (sessionUser.role === 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Admins cannot execute handshakes' })
  }

  return await db.transaction(async (tx) => {
    const offer = await getOfferById(offerId, sessionUser, tx)

    // Case 0: Offer is finalized already
    if (offer.status === 'accepted' || offer.status === 'rejected' || offer.status === 'withdrawn') {
      throw createError({ statusCode: 400, statusMessage: 'Offer is already finalized' })
    }

    const now = new Date()

    // Case 1: A freelancer can only act if the company accepted the offer first
    if (sessionUser.accountType === 'freelancer') {
      if (offer.status !== 'company_accepted') {
        throw createError({ statusCode: 400, statusMessage: 'Waiting for company approval' })
      }

      if (action === 'decline') {
        const [updatedOffer] = await tx.update(tables.offers)
          .set({ status: 'rejected', updatedAt: now })
          .where(eq(tables.offers.id, offerId))
          .returning()

        return offerSchema.parse(updatedOffer)
      }

      const [updatedOffer] = await tx.update(tables.offers)
        .set({ status: 'accepted', updatedAt: now })
        .where(eq(tables.offers.id, offerId))
        .returning()

      const job = await tx.query.jobs.findFirst({ where: eq(tables.jobs.id, offer.jobId) })

      if (!job) {
        throw createError({ statusCode: 404, statusMessage: 'Job missing' })
      }

      await tx.insert(tables.bookings).values({
        offerId: offer.id,
        jobId: offer.jobId,
        buyerId: offer.buyerId,
        sellerId: offer.sellerId,
        hourlyRate: offer.proposedHourlyRate,
        duration: job.duration,
        price: offer.proposedHourlyRate * job.duration,
        workplace: job.workplace,
        status: 'upcoming',
        createdAt: now,
        updatedAt: now
      })

      await tx.update(tables.jobs)
        .set({ status: 'booked', updatedAt: now })
        .where(eq(tables.jobs.id, offer.jobId))

      return offerSchema.parse(updatedOffer)
    }

    // Case 2: A company can only act if the offer is pending for approval
    else {
      if (offer.status !== 'pending') {
        throw createError({ statusCode: 400, statusMessage: 'Company action window closed' })
      }

      if (action === 'decline') {
        const [updatedOffer] = await tx.update(tables.offers)
          .set({ status: 'rejected', updatedAt: now })
          .where(eq(tables.offers.id, offerId))
          .returning()

        return offerSchema.parse(updatedOffer)
      }

      const [updatedOffer] = await tx.update(tables.offers)
        .set({ status: 'company_accepted', updatedAt: now })
        .where(eq(tables.offers.id, offerId))
        .returning()

      return offerSchema.parse(updatedOffer)
    }
  })
}
