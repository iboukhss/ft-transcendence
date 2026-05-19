import { eq, and } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db'

import { toBookingResponseDTO } from '#server/dto/bookings.dto'

export async function deleteBooking(db: DB, tables: Tables, bookingId: number) {
  const [deletedBooking] = await db
    .delete(tables.bookings)
    .where(
      and(
        eq(tables.bookings.id, bookingId)
      )
    )
    .returning()

  if (!deletedBooking) return throw500('Booking could not be deleted')

  return toBookingResponseDTO(deletedBooking)
}
