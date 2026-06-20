import { z } from 'zod'

import { handleOfferHandshake } from '#server/services/offers/handle-offer-handshake.service.js'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'

// NOTE(isma): Why not something like /api/offers/:id/accept and /api/offers/:id/decline ?
// It's more "RESTful", read more here in paragraph #3:
// https://restfulapi.net/resource-naming/
const handshakePaylaodSchema = z.object({
  action: z.enum(['accept', 'decline'])
})

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  const offerId = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { action } = handshakePaylaodSchema.parse(body)
  return handleOfferHandshake(offerId, action, session.user)
})
