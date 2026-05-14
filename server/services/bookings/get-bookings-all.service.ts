import type { DB } from '#server/utils/db'

import { toBookingsResponseDTO } from '#server/dto/bookings.dto'

export async function getBookingsAll(db: DB) {
  const bookings = await db.query.bookings.findMany()

  return toBookingsResponseDTO(bookings)
}
