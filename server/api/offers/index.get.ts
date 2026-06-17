import { getOffers } from '#server/services/offers/get-offers.service'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  return getOffers(session.user.id, session.user.accountType)
})
