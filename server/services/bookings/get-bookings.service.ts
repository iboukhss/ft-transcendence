import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'

import type { User } from '#auth-utils'
import type { DashboardBookingDTO } from '#shared/dto/booking.dto'

import { db, tables } from '#server/utils/db'
import { dashboardBookingSchema } from '#shared/dto/booking.dto'

export async function getBookings(sessionUser: User): Promise<DashboardBookingDTO[]> {
  const conditions = []

  if (sessionUser.role !== 'admin') {
    const ownerCondition = sessionUser.accountType === 'freelancer'
      ? eq(tables.bookings.sellerId, sessionUser.id)
      : eq(tables.bookings.buyerId, sessionUser.id)

    conditions.push(ownerCondition)
  }

  const bookings = await db.query.bookings.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    with: {
      job: {
        columns: {
          title: true,
          location: true
        }
      },
      buyer: {
        columns: {
          companyName: true
        }
      },
      seller: {
        columns: {
          firstName: true,
          lastName: true
        }
      }
    },
    orderBy: [desc(tables.bookings.createdAt)]
  })

  return z.array(dashboardBookingSchema).parse(bookings)
}
