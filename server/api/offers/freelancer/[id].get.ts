// get application to jobId
import { getOffer } from '#server/services/offers/freelancer/get-offer.service'
// post application to jobId
import { db, tables } from '#server/utils/db'
import { getRouterParamAsNumber } from '#server/utils/router.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  requireFreelancer(session.user)

  const jobId = getRouterParamAsNumber(event)

  const offer = await getOffer(db, tables, session.user.id, jobId)

  return offer
})
