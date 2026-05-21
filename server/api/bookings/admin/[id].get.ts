// patch application to jobId
import { getBooking } from '#server/services/bookings/admin/get-booking.service.js'
// post application to jobId
import { db, tables } from '#server/utils/db'
import { getRouterParamAsNumber } from '#server/utils/router.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  requireAdmin(session.user)

  const bookingId = getRouterParamAsNumber(event)

  return (
    await getBooking(
      db,
      tables,
      bookingId
    )
  )
})
