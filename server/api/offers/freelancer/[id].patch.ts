// patch application to jobId
import { updateOffer } from '#server/services/offers/freelancer/update-offer.service'
// post application to jobId
import { db, tables } from '#server/utils/db'
import { getRouterParamAsNumber } from '#server/utils/router.js'
import { offerSchema } from '#shared/dto/offer.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  requireFreelancer(session.user)

  const jobId = getRouterParamAsNumber(event)

  const body = await readBody(event)

  const result = offerSchema.safeParse(body)

  const validData = validateOrThrow(result)

  const offer = await updateOffer(db, tables, session.user.id, validData, jobId)

  return offer
})
