// get application to jobId
import { getOfferById } from '#server/services/offers/get-offer.service.js'
import { db, tables } from '#server/utils/db'
import { getRouterParamAsNumber } from '#server/utils/router.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  requireFreelancer(session.user)

  const jobId = getRouterParamAsNumber(event)

  return (
    await getOfferById(
      db,
      tables,
      jobId,
      session.user.id,
      session.user.accountType as 'freelancer' | 'company' | 'admin'
    )
  )
})
