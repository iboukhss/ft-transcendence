// Must read:
// https://vueschool.io/articles/vuejs-tutorials/database-seeds-with-the-nuxt-task-runner/

// This solution however has a few shortcomings:
// https://github.com/nuxt/cli/issues/992

import { faker } from '@faker-js/faker'
import { reset } from 'drizzle-seed'

import { db, tables } from '#server/utils/db'
import { COUNTRY_KEYS, JOB_CATEGORY_KEYS, SKILL_KEYS, WORKPLACE_KEYS } from '#shared/constants/enums'

export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Seeds the local database with dummy data'
  },

  async run() {
    try {
      console.log('Purging existing tables...')
      await reset(db, tables)

      // NOTE(isma): This is supposed to make seeding more (completely?) deterministic
      faker.seed(42)

      const MOCK_HASHED_PASSWORD = await hashPassword('password')
      const ADMIN_HASHED_PASSWORD = await hashPassword('admin')

      console.log('Generating admin account...')
      const [insertedAdmin] = await db
        .insert(tables.users)
        .values({
          email: 'admin@luxlink.com',
          password: ADMIN_HASHED_PASSWORD,
          accountType: 'company',
          role: 'admin',
          createdAt: new Date()
        })
        .returning()

      await db
        .insert(tables.profiles)
        .values({
          userId: insertedAdmin.id,
          firstName: 'Admin',
          lastName: 'Admin',
          country: 'fr'
        })

      console.log('Generating 12 freelancer accounts...')
      for (let i = 0; i < 12; i++) {
        const [insertedUser] = await db
          .insert(tables.users)
          .values({
            email: faker.internet.email().toLowerCase(),
            password: MOCK_HASHED_PASSWORD,
            accountType: 'freelancer',
            role: 'user',
            createdAt: new Date()
          })
          .returning()

        await db
          .insert(tables.freelancerProfiles)
          .values(({
            userId: insertedUser.id,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            country: faker.helpers.arrayElement(COUNTRY_KEYS),
            avatar: faker.image.urlLoremFlickr({ width: 300, height: 300, category: 'kitten' }),
            bio: faker.person.bio()
          }))
      }

      console.log('Generating 12 company accounts...')
      for (let i = 0; i < 12; i++) {
        const [insertedUser] = await db
          .insert(tables.users)
          .values({
            email: faker.internet.email().toLowerCase(),
            password: MOCK_HASHED_PASSWORD,
            accountType: 'company',
            role: 'user',
            createdAt: new Date()
          })
          .returning()

        await db
          .insert(tables.apiKeys)
          .values({
            userId: insertedUser.id,
            key: `secret-key-${faker.string.uuid()}`,
            name: `${faker.company.name().split(' ')[0]} Integration Key`,
            isActive: true
          })

        const [insertedCompany] = await db
          .insert(tables.companyProfiles)
          .values({
            userId: insertedUser.id,
            contactFirstName: faker.person.firstName(),
            contactLastName: faker.person.lastName(),
            companyName: faker.company.name(),
            country: faker.helpers.arrayElement(COUNTRY_KEYS),
            logo: faker.image.urlLoremFlickr({ width: 300, height: 300, category: 'owl' }),
            website: faker.internet.url(),
            description: faker.company.catchPhrase() + '. ' + faker.lorem.paragraph()
          })

        const jobsCount = faker.number.int({ min: 1, max: 4 })
        for (let j = 0; j < jobsCount; j++) {
          await db
            .insert(tables.jobs)
            .values({
              userId: insertedUser.id,
              title: faker.person.jobTitle(),
              description: faker.lorem.paragraphs(2),
              category: faker.helpers.arrayElement(JOB_CATEGORY_KEYS),
              skills: faker.helpers.arrayElements(SKILL_KEYS, { min: 1, max: 3 }),
              hourlyRate: faker.number.int({ min: 1.0, max: 500.0 }),
              duration: faker.number.int({ min: 1, max: 12 }),
              workplace: faker.helpers.arrayElement(WORKPLACE_KEYS),
              location: faker.helpers.arrayElement(COUNTRY_KEYS),
              createdAt: faker.date.recent({ days: 14 })
            })
        }
      }
      return { result: 'Database seeded successfully.' }
    }
    catch (err: any) {
      return { result: 'Seeding failed', details: err.message }
    }
  }
})
