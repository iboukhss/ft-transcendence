import { deleteOffer } from '#server/services/offers/delete-offer.service.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  requireFreelancer(session.user)

  const offerId = Number(getRouterParam(event, 'id'))

  return deleteOffer(offerId, session.user.id)
})
