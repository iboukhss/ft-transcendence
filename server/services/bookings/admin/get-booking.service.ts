import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db.js'

import { throw500 } from '#imports'
import { toBookingsResponseDTO } from '#server/dto/bookings.dto.js'

export async function getBooking(db: DB, tables: Tables, bookingId: number) {
  const bookings = await db
    .select()
    .from(tables.bookings)
    .where(eq(tables.bookings.id, bookingId))

  if (bookings.length === 0) {
    throw500('Bookings could not be retrieved')
  }

  return toBookingsResponseDTO(bookings)
}
