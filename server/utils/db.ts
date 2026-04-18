// Read the docs
// https://orm.drizzle.team/docs/get-started-postgresql

import postgres from 'postgres'
import { env } from '#server/utils/env'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '#server/database/schema'

export const queryClient = postgres(env.DATABASE_URL)
export const tables = schema
export const db = drizzle(queryClient, { schema })
