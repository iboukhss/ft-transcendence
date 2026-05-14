import { acceptOffer } from '#server/services/offers/accept.service.js'
import { db, tables } from '#server/utils/db'
import { getRouterParamAsNumber } from '#server/utils/router.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const offerId = getRouterParamAsNumber(event)

  return (
    await acceptOffer(
      db,
      tables,
      offerId,
      session.user.id,
      session.user.accountType as 'freelancer' | 'company' | 'admin'
    )
  )
})
