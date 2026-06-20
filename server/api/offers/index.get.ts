import { getOffers } from '#server/services/offers/get-offers.service'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  return getOffers(session.user.id, session.user)
})
