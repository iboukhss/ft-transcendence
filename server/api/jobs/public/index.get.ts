import { getJobsAll } from '#server/services/jobs/public/get-jobs-all.service.js'

export default defineEventHandler(async () => {
  return (getJobsAll(db, tables))
})
