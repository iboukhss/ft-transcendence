import { getOfferById } from '#server/services/offers/get-offer-by-id.service'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const offerId = Number(getRouterParam(event, 'id'))

  return getOfferById(offerId, session.user)
})
