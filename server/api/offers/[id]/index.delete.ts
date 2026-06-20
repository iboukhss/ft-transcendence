import { deleteOffer } from '#server/services/offers/delete-offer.service.js'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  requireFreelancer(session.user)

  const offerId = Number(getRouterParam(event, 'id'))
  return deleteOffer(offerId, session.user.id)
})
