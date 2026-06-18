import { updateOffer } from '#server/services/offers/update-offer.service'
import { updateOfferSchema } from '#shared/dto/offer.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  requireFreelancer(session.user)

  const offerId = Number(getRouterParam(event, 'id'))

  const body = await readBody(event)
  const result = updateOfferSchema.safeParse(body)
  const validData = validateOrThrow(result)

  return updateOffer(offerId, validData, session.user)
})
