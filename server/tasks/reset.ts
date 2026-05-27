import { reset } from 'drizzle-seed'

import { db, tables } from '#server/utils/db'

export default defineTask({
  meta: {
    name: 'db:reset',
    description: 'Uses drizzle-seed to completely reset the database'
  },

  async run() {
    try {
      await reset(db, tables)

      console.log('Database reset complete!')
      return { result: 'Database reset success' }
    }
    catch (err: any) {
      console.error('Database reset failed:', err.message)
      return { result: 'Database reset failure', details: err.message }
    }
  }
})
