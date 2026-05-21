import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db.js'
import type { UpdateBookingDTO } from '#shared/dto/booking.dto.js'

import { throw404 } from '#imports'
import { toBookingsResponseDTO } from '#server/dto/bookings.dto.js'

export async function updateBooking(db: DB, tables: Tables, bookingId: number, dto: UpdateBookingDTO) {
  const bookings = await db
    .update(tables.bookings)
    .set({
      price: dto.price,
      hourlyRate: dto.hourlyRate,
      duration: dto.duration,
      workplace: dto.workplace,
      status: dto.status,
      updatedAt: new Date()
    })
    .where(eq(tables.bookings.id, bookingId))
    .returning()

  if (bookings.length === 0) {
    throw404('Booking not found')
  }

  return toBookingsResponseDTO(bookings)
}
