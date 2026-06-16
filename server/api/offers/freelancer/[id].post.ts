import { createOffer } from '#server/services/offers/freelancer/create-offer.service'
// post application to jobId
import { db, tables } from '#server/utils/db'
import { getRouterParamAsNumber } from '#server/utils/router.js'
import { createOfferSchema } from '#shared/dto/offer.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  requireFreelancer(session.user)

  const jobId = getRouterParamAsNumber(event)

  const body = await readBody(event)

  const result = createOfferSchema.safeParse(body)

  const validData = validateOrThrow(result)

  return (
    await createOffer(
      db,
      tables,
      session.user.id,
      validData,
      jobId
    )
  )
})
