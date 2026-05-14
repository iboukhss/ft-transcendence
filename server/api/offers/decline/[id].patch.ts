import { declineOffer } from '#server/services/offers/decline.service.js'
import { db, tables } from '#server/utils/db'
import { getRouterParamAsNumber } from '#server/utils/router.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const offerId = getRouterParamAsNumber(event)

  return (
    await declineOffer(
      db,
      tables,
      offerId,
      session.user.id,
      session.user.accountType as 'freelancer' | 'company' | 'admin'
    )
  )
})
