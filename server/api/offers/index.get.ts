// get all applications of the current user
import { getOffers } from '#server/services/offers/get-offers.service'
import { db, tables } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const offers = await getOffers(
    db,
    tables,
    session.user.id,
    session.user.accountType as 'freelancer' | 'company' | 'admin'
  )

  return offers
})
