import { z } from 'zod'

import { handleOfferHandshake } from '#server/services/offers/handle-offer-handshake.service.js'

const handshakePaylaodSchema = z.object({
  action: z.enum(['accept', 'decline'])
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const offerId = Number(getRouterParam(event, 'id'))

  const body = await readBody(event)
  const { action } = handshakePaylaodSchema.parse(body)

  return handleOfferHandshake(offerId, action, session.user)
})
