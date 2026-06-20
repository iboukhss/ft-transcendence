import { getBookings } from '#server/services/bookings/get-bookings.service'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'

export default eventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  return getBookings(session.user)
})
