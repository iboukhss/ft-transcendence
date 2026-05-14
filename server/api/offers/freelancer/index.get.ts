// get all applications of the current user
import { getOffers } from '#server/services/get-offers.service.ts'
import { db, tables } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  requireCompany(session.user)

  const offers = getOffers(db, tables, session.user.id)

  return offers
})
