import { relations } from 'drizzle-orm'
import { pgTable, unique, serial, text, pgEnum, timestamp, integer, real, boolean } from 'drizzle-orm/pg-core'

import {
  ROLE_KEYS,
  ACCOUNT_TYPE_KEYS,
  COUNTRY_KEYS,
  WORKPLACE_KEYS,
  LANGUAGE_KEYS,
  OFFER_STATUS_KEYS,
  BOOKING_STATUS_KEYS,
  JOB_CATEGORY_KEYS,
  SKILL_KEYS,
  JOB_STATUS_KEYS
} from '#shared/constants/enums'

export const roleEnum = pgEnum('roleEnum', ROLE_KEYS)
export const accountTypeEnum = pgEnum('accountTypeEnum', ACCOUNT_TYPE_KEYS)
export const countryEnum = pgEnum('countryEnum', COUNTRY_KEYS)
export const workPlaceEnum = pgEnum('workPlaceEnum', WORKPLACE_KEYS)
export const languageEnum = pgEnum('languageEnum', LANGUAGE_KEYS)
export const jobStatusEnum = pgEnum('jobStatusEnum', JOB_STATUS_KEYS)
export const offerStatusEnum = pgEnum('offerStatusEnum', OFFER_STATUS_KEYS)
export const bookingStatusEnum = pgEnum('bookingStatusEnum', BOOKING_STATUS_KEYS)
export const categoryEnum = pgEnum('categoryEnum', JOB_CATEGORY_KEYS)
export const skillsEnum = pgEnum('skillsEnum', SKILL_KEYS)

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  accountType: accountTypeEnum('account_type').notNull(),
  role: roleEnum('role').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const freelancerProfiles = pgTable('freelancer_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  country: countryEnum('country').notNull(),
  avatar: text('avatar'),
  bio: text('bio').notNull().default(''),
  skills: text('skills').array().notNull().default([]),
  languages: languageEnum('languages').array().notNull().default([]),
  hourlyRate: real('hourly_rate'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const companyProfiles = pgTable('company_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  contactFirstName: text('contact_first_name').notNull(),
  contactLastName: text('contact_last_name').notNull(),
  companyName: text('company_name').notNull(),
  country: countryEnum('country').notNull(),
  logo: text('logo'),
  description: text('description').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: categoryEnum('category').notNull(),

  // We lose a little typesafety here for a more confortable query experience.
  // This row used to be a PgEnum array.
  skills: text('skills').array().notNull().default([]),

  hourlyRate: real('hourly_rate').notNull(),
  duration: integer('duration').notNull(),
  workplace: workPlaceEnum('workplace').notNull(),
  location: countryEnum('location').notNull(),
  status: jobStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  offerId: integer('offer_id').notNull().references(() => offers.id).unique(),
  jobId: integer('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  buyerId: integer('buyer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sellerId: integer('seller_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  price: real('price').notNull(),
  hourlyRate: real('hourly_rate').notNull(),
  duration: integer('duration').notNull(),
  status: bookingStatusEnum('status').notNull().default('upcoming'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const offers = pgTable('offers', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  buyerId: integer('buyer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sellerId: integer('seller_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: offerStatusEnum('status').notNull().default('pending'),
  motivationLetter: text('motivation_letter').notNull(),
  proposedHourlyRate: real('proposed_hourly_rate').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
}, table => [
  unique('offers_job_id_seller_id_unique').on(table.jobId, table.sellerId)
])

export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  key: text('key').notNull().unique(),
  name: text('name').notNull().default('Default Key'),
  isActive: boolean('is_active').notNull().default(true),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const offersRelations = relations(offers, ({ one }) => ({
  job: one(jobs, {
    fields: [offers.jobId],
    references: [jobs.id]
  }),
  seller: one(freelancerProfiles, {
    fields: [offers.sellerId],
    references: [freelancerProfiles.userId]
  })
}))

export const bookingsRelations = relations(bookings, ({ one }) => ({
  job: one(jobs, {
    fields: [bookings.jobId],
    references: [jobs.id]
  }),
  buyer: one(companyProfiles, {
    fields: [bookings.buyerId],
    references: [companyProfiles.userId]
  }),
  seller: one(freelancerProfiles, {
    fields: [bookings.sellerId],
    references: [freelancerProfiles.userId]
  })
}))
