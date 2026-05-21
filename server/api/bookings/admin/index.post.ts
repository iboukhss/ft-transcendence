// patch application to jobId
import { insertBooking } from '#server/services/bookings/admin/insert-booking.service'
import { db, tables } from '#server/utils/db'
// post application to jobId
import { insertBookingSchema } from '#shared/dto/booking.dto'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  requireAdmin(session.user)

  const body = await readBody(event)

  const result = insertBookingSchema.safeParse(body)

  const validData = validateOrThrow(result)

  return (
    await insertBooking(
      db,
      tables,
      validData
    )
  )
})
