import { pgTable, unique, serial, text, pgEnum, timestamp, integer, real } from 'drizzle-orm/pg-core'

import {
  ROLE_KEYS,
  ACCOUNT_TYPE_KEYS,
  COUNTRY_KEYS,
  WORKPLACE_KEYS,
  LANGUAGE_KEYS,
  OFFER_STATUS_KEYS,
  BOOKING_STATUS_KEYS,
  JOB_CATEGORY_KEYS,
  SKILL_KEYS
} from '#shared/constants/enums'

export const roleEnum = pgEnum('roleEnum', ROLE_KEYS)

export const accountTypeEnum = pgEnum('accountTypeEnum', ACCOUNT_TYPE_KEYS)

export const countryEnum = pgEnum('countryEnum', COUNTRY_KEYS)

export const workPlaceEnum = pgEnum('workPlaceEnum', WORKPLACE_KEYS)

export const languageEnum = pgEnum('languageEnum', LANGUAGE_KEYS)

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
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  houseNumber: integer('house_number'),
  street: text('street'),
  zip: text('zip'),
  country: countryEnum('country').notNull(),
  avatar: text('avatar'),
  about: text('about'),
  skills: skillsEnum('skills').array(),
  languages: languageEnum('languages').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: categoryEnum('category').notNull(),
  skills: skillsEnum('skills').array().notNull(),
  hourlyRate: real('hourly_rate').notNull(),
  duration: integer('duration').default(1).notNull(),
  workplace: workPlaceEnum('workplace').notNull(),
  location: countryEnum('location').notNull(),
  status: offerStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').notNull().references(() => jobs.id),
  buyerId: integer('buyer_id').notNull().references(() => users.id),
  sellerId: integer('seller_id').notNull().references(() => users.id),
  price: real('price').notNull(),
  status: bookingStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const offers = pgTable('offers', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').notNull().references(() => jobs.id),
  buyerId: integer('buyer_id').notNull().references(() => users.id),
  sellerId: integer('seller_id').notNull().references(() => users.id),
  status: bookingStatusEnum('status').default('pending').notNull(),
  motivationLetter: text('motivation_letter').notNull(),
  proposedHourlyRate: real('proposed_hourly_rate'),
  proposedDuraton: integer('proposed_duration'),
  proposedWorkplace: workPlaceEnum('proposed_workplace'),
  buyerAgreed: timestamp('buyer_agreed'),
  sellerAgreed: timestamp('seller_agreed'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    oncePerOffer: unique().on(table.jobId, table.buyerId)
  }
})
