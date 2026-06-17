import { createOffer } from '#server/services/offers/create-offer.service.js'
import { createOfferSchema } from '#shared/dto/offer.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  requireFreelancer(session.user)

  const body = await readBody(event)
  const result = createOfferSchema.safeParse(body)
  const validData = validateOrThrow(result)

  return createOffer(session.user.id, validData)
})
