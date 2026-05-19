import { getBookingsUser } from '#server/services/bookings/get-bookings-user.service.js'
import { db, tables } from '#server/utils/db'

export default eventHandler(async (event) => {
  const session = await requireUserSession(event)

  return getBookingsUser(
    db,
    tables,
    session.user.id,
    session.user.accountType
  )
})
