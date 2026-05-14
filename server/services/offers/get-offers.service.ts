import type { DB, Tables } from '#server/utils/db'

export async function getOffers(db: DB, tables: Tables, userId: number) {
  const offers = await db.query.offers.findMany({
    .where(eq(tables.offerStatusEnums))
  })
}
