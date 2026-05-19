// patch application to jobId
import { deleteBooking } from '#server/services/bookings/admin/delete-booking.service.js'
// post application to jobId
import { db, tables } from '#server/utils/db'
import { getRouterParamAsNumber } from '#server/utils/router.js'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  requireAdmin(session.user)

  const bookingId = getRouterParamAsNumber(event)

  return (
    await deleteBooking(
      db,
      tables,
      bookingId
    )
  )
})
