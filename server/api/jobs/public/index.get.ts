import { getJobsAll } from '#server/services/jobs/public/get-jobs-all.service.js'
import { db } from '#server/utils/db'

export default defineEventHandler(async () => {
  return (getJobsAll(db))
})
