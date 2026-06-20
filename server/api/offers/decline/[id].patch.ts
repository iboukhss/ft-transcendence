import { declineOffer } from '#server/services/offers/decline.service.js'
import { db, tables } from '#server/utils/db'
import { getRouterParamAsNumber } from '#server/utils/router.js'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
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
