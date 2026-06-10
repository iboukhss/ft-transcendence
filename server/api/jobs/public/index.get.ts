import { getJobsAll } from '#server/services/jobs/public/get-jobs-all.service'

export default defineEventHandler(async () => {
  return getJobsAll()
})
