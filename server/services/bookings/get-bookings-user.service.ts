import { eq } from 'drizzle-orm'

import type { DB, Tables } from '#server/utils/db.js'

import { throw403 } from '#imports'
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
    return throw403('Invalid account type')
  }
  console.log(filter)

  const bookings = await db
    .select()
    .from(tables.bookings)
    .where(filter)

  // An empty array is a valid result (e.g. user has no bookings yet) — not an error.
  return toBookingsResponseDTO(bookings)
}
