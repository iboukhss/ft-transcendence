import { getBookingsAll } from '#server/services/bookings/get-bookings-all.service.js'
import { db } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  return (getBookingsAll(db))
})
