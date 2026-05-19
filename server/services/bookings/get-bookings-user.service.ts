import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db.js'

import { throw500, throw403 } from '#imports'
import { toBookingsResponseDTO } from '#server/dto/bookings.dto.js'

export async function getBookingsUser(db: DB, tables: Tables, userId: number, accountType: string) {
  let filter: any = undefined

  if (accountType === 'freelancer') {
    filter = eq(tables.bookings.sellerId, userId)
  }
  else if (accountType === 'company') {
    filter = eq(tables.bookings.buyerId, userId)
  }
  else if (accountType !== 'admin') {
    throw403('Invalid account type')
  }
  const bookings = await db
    .select()
    .from(tables.bookings)
    .where(filter)

  if (bookings.length === 0) {
    throw500('Bookings could not be retrieved')
  }

  return toBookingsResponseDTO(bookings)
}
