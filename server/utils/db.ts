// Read the docs
// https://orm.drizzle.team/docs/get-started-postgresql

import type { InferSelectModel } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from '#server/database/schema'

const config = useRuntimeConfig()

export const queryClient = postgres(config.databaseUrl)
export const db = drizzle(queryClient, { schema })

export const tables = schema

export type DB = PostgresJsDatabase<typeof schema>
export type Tables = typeof schema

// Relevant discussion
// https://github.com/drizzle-team/drizzle-orm/issues/2851#issuecomment-2517850853
export type Transaction = Parameters<Parameters<DB['transaction']>[0]>[0]

export type DBUser = InferSelectModel<typeof schema.users>
export type DBJob = InferSelectModel<typeof schema.jobs>
export type DBFreelancer = InferSelectModel<typeof schema.freelancerProfiles>
export type DBCompany = InferSelectModel<typeof schema.companyProfiles>
export type DBProfile = DBFreelancer | DBCompany
export type DBOffer = InferSelectModel<typeof schema.offers>
export type DBBooking = InferSelectModel<typeof schema.bookings>
