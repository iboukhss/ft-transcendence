// Read the docs
// https://orm.drizzle.team/docs/get-started-postgresql

import type { InferSelectModel } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from '#server/database/schema'
import { env } from '#server/utils/env'

export const queryClient = postgres(env.DATABASE_URL)
export const tables = schema
export const db = drizzle(queryClient, { schema })

export type DB = PostgresJsDatabase<typeof schema>
export type Tables = typeof schema
export type Transaction = Parameters<Parameters<DB['transaction']>[0]>[0]
export type DBUser = InferSelectModel<typeof schema.users>
export type DBJob = InferSelectModel<typeof schema.jobs>
export type DBProfile = InferSelectModel<typeof schema.profiles>
