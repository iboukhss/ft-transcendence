import { getJobsAll } from '#server/services/jobs/public/get-jobs-all.service'

export default defineEventHandler(async (event) => {
  const { page } = getQuery(event)
  if (!page)
    return ([])
  return getJobsAll(parseInt(page as string))
})
