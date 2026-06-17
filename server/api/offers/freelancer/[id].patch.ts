import { updateOffer } from '#server/services/offers/freelancer/update-offer.service'
import { db, tables } from '#server/utils/db'
import { getRouterParamAsNumber } from '#server/utils/router.js'
import { createOfferSchema } from '#shared/dto/offer.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  requireFreelancer(session.user)

  const offerId = getRouterParamAsNumber(event)  // ← correctly named: offer ID from URL

  const body = await readBody(event)
  const result = createOfferSchema.safeParse(body)
  const validData = validateOrThrow(result)

  return updateOffer(
    db,
    tables,
    session.user.id,
    validData,
    offerId               // ← pass as offerId, not jobId
  )
})
