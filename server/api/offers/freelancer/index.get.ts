// get all applications of the current user

import { getOffersUser } from '#server/services/offers/get-offers-user.service.js'
import { db, tables } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  requireFreelancer(session.user)

  return (
    await getOffersUser(
      db,
      tables,
      session.user.id,
      session.user.accountType as 'freelancer' | 'company' | 'admin'
    )
  )
})
