import type { DB, Tables } from '#server/utils/db.js'
import type { InsertBookingDTO } from '#shared/dto/booking.dto'

import { throw500 } from '#imports'
import { toBookingsResponseDTO } from '#server/dto/bookings.dto'

export async function insertBooking(db: DB, tables: Tables, dto: InsertBookingDTO) {
  const newBooking = await db
    .insert(tables.bookings)
    .values({
      ...dto
    })
    .returning()

  if (newBooking.length === 0) {
    throw500('Booking not found')
  }

  return toBookingsResponseDTO(newBooking)
}
