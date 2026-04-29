import { pgTable, serial, text, pgEnum, timestamp, integer, real } from 'drizzle-orm/pg-core'

import {
  ROLE_KEYS,
  ACCOUNT_TYPE_KEYS,
  COUNTRY_KEYS,
  WORKPLACE_KEYS,
  LANGUAGE_KEYS,
  OFFER_STATUS_KEYS,
  ORDER_STATUS_KEYS,
  JOB_CATEGORY_KEYS,
  SKILL_KEYS
} from '#shared/constants/enums'

export const roleEnum = pgEnum('roleEnum', ROLE_KEYS)

export const accountTypeEnum = pgEnum('accountTypeEnum', ACCOUNT_TYPE_KEYS)

export const countryEnum = pgEnum('countryEnum', COUNTRY_KEYS)

export const workPlaceEnum = pgEnum('workPlaceEnum', WORKPLACE_KEYS)

export const languageEnum = pgEnum('languageEnum', LANGUAGE_KEYS)

export const offerStatusEnum = pgEnum('offerStatusEnum', OFFER_STATUS_KEYS)

export const orderStatusEnum = pgEnum('orderStatusEnum', ORDER_STATUS_KEYS)

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
  language: languageEnum('language'),
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

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').notNull().references(() => jobs.id),
  buyerId: integer('buyer_id').notNull().references(() => users.id),
  sellerId: integer('seller_id').notNull().references(() => users.id),
  price: real('price').notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
