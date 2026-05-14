import { getJobById } from "#server/services/jobs/public/get-job.service.js";
import { db, tables} from '#server/utils/db'
import { getRouterParamAsNumber } from "#server/utils/router.js";

export default defineEventHandler(async (event) => {

  const jobId = getRouterParamAsNumber(event)

  const job = await getJobById(db, tables, jobId)

  return job
})
