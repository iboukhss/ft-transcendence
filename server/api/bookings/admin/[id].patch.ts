// patch application to jobId
import { updateBooking } from '#server/services/bookings/admin/update-booking.service'
import { db, tables } from '#server/utils/db'
import { getRouterParamAsNumber } from '#server/utils/router.js'
// post application to jobId
import { updateBookingSchema } from '#shared/dto/booking.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  requireAdmin(session.user)

  const body = await readBody(event)

  const result = updateBookingSchema.safeParse(body)

  const validData = validateOrThrow(result)

  const bookingId = getRouterParamAsNumber(event)

  return (
    await updateBooking(
      db,
      tables,
      bookingId,
      validData
    )
  )
})
