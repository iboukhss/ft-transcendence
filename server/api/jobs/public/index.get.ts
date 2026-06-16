import { getJobsAll, getJobsAmount } from '#server/services/jobs/public/get-jobs-all.service'

export default defineEventHandler(async (event) => {
  const { page } = getQuery(event)
  if (!page) {
    const amount = await getJobsAmount()
    return (JSON.stringify({ JobsAmount: amount }))
  }
  return getJobsAll(parseInt(page as string))
})
