import { pgTable, serial, text, pgEnum, timestamp, integer, real } from 'drizzle-orm/pg-core'

import {
  RoleEnum,
  CountryEnum,
  WorkPlaceEnum,
  LanguageEnum,
  OfferStatusEnum,
  OrderStatusEnum,
  CategoryEnum,
  SkillsEnum
} from '#shared/constants/enums'

export const roleEnum = pgEnum('roleEnum', RoleEnum)

export const countryEnum = pgEnum('countryEnum', CountryEnum)

export const workPlaceEnum = pgEnum('workPlaceEnum', WorkPlaceEnum)

export const languageEnum = pgEnum('languageEnum', LanguageEnum)

export const offerStatusEnum = pgEnum('offerStatusEnum', OfferStatusEnum)

export const orderStatusEnum = pgEnum('orderStatusEnum', OrderStatusEnum)

export const categoryEnum = pgEnum('categoryEnum', CategoryEnum)

export const skillsEnum = pgEnum('skillsEnum', SkillsEnum)

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
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

export const offers = pgTable('offers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: categoryEnum('category').notNull(),
  skills: skillsEnum('skills').notNull(),
  hourlyRate: real('hourly_rate').notNull(),
  duration: integer('duration').default(1).notNull(),
  workPlace: workPlaceEnum('work_place').notNull(),
  location: countryEnum('location').notNull(),
  status: offerStatusEnum('status').default('Active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  offerId: integer('offer_id').notNull().references(() => offers.id),
  buyerId: integer('buyer_id').notNull().references(() => users.id),
  sellerId: integer('seller_id').notNull().references(() => users.id),
  price: real('price').notNull(),
  status: orderStatusEnum('status').default('Pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
