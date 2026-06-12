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
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const freelancerProfiles = pgTable('freelancer_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  country: countryEnum('country').notNull(),
  avatar: text('avatar'),
  bio: text('bio'),
  skills: skillsEnum('skills').array().notNull().default([]),
  languages: languageEnum('languages').array().notNull().default([]),
  hourlyRate: real('hourly_rate'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const companyProfiles = pgTable('company_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  contactFirstName: text('contact_first_name').notNull(),
  contactLastName: text('contact_last_name').notNull(),
  companyName: text('company_name').notNull(),
  country: countryEnum('country').notNull(),
  website: text('website'),
  logo: text('logo'),
  description: text('description'),
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
  status: jobStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  offerId: integer('offer_id').notNull().references(() => offers.id),
  jobId: integer('job_id').notNull().references(() => jobs.id),
  buyerId: integer('buyer_id').notNull().references(() => users.id),
  sellerId: integer('seller_id').notNull().references(() => users.id),
  price: real('price').notNull(),
  hourlyRate: real('hourly_rate').notNull(),
  duration: integer('duration').notNull(),
  workplace: workPlaceEnum('workplace'),
  status: bookingStatusEnum('status').default('upcoming').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, table => ({
  oncePerOffer: unique().on(table.offerId)
}))

export const offers = pgTable('offers', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').notNull().references(() => jobs.id),
  buyerId: integer('buyer_id').notNull().references(() => users.id),
  sellerId: integer('seller_id').notNull().references(() => users.id),
  status: offerStatusEnum('status').default('pending').notNull(),
  motivationLetter: text('motivation_letter').notNull(),
  proposedHourlyRate: real('proposed_hourly_rate'),
  proposedDuration: integer('proposed_duration'),
  proposedWorkplace: workPlaceEnum('proposed_workplace'),
  buyerAgreed: timestamp('buyer_agreed'),
  sellerAgreed: timestamp('seller_agreed'),
  buyerDeclined: timestamp('buyer_declined'),
  sellerDeclined: timestamp('seller_declined'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    oncePerOffer: unique().on(table.jobId, table.sellerId)
  }
})

export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  key: text('key').notNull().unique(),
  name: text('name').notNull().default('Default Key'),

  isActive: boolean('is_active').notNull().default(true),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
