// patch application to jobId
import { deleteOffer } from '#server/services/offers/freelancer/delete-offer.service'
// post application to jobId
import { db, tables } from '#server/utils/db'
import { getRouterParamAsNumber } from '#server/utils/router.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  requireFreelancer(session.user)

  const offerId = getRouterParamAsNumber(event)

  return (
    await deleteOffer(
      db,
      tables,
      session.user.id,
      offerId
    )
  )
})
