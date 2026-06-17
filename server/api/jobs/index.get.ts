import { getQuery } from 'h3'
import { z } from 'zod'

import { getJobs, getJobsAmount } from '#server/services/jobs/get-jobs.service.js'

const querySchema = z.object({
  page: z.string().optional(),
  userId: z.coerce.number().optional(),
  search: z.string().optional()
})

export default defineEventHandler(async (event) => {
  console.log(getQuery(event))
  const query = await getValidatedQuery(event, querySchema.parse)
  if (!query.page) {
    const amount = await getJobsAmount()
    return (JSON.stringify({ JobsAmount: amount }))
  }
  return getJobs({ userId: query.userId, page: parseInt(query.page as string) })
})
