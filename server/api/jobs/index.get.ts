import { z } from 'zod'

import { getJobs } from '#server/services/jobs/get-jobs.service.js'

const querySchema = z.object({
  userId: z.coerce.number().optional(),
  search: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)

  return getJobs({ userId: query.userId })
})
