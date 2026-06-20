import { getBookings } from '#server/services/bookings/get-bookings.service'

export default eventHandler(async (event) => {
  const session = await requireUserSession(event)

  return getBookings(session.user)
})
