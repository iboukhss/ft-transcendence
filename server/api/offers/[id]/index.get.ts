import { getOfferById } from '#server/services/offers/get-offer-by-id.service'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  const offerId = Number(getRouterParam(event, 'id'))
  return getOfferById(offerId, session.user)
})
