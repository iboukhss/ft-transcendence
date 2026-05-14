import { getJobById } from "#server/services/jobs/public/get-job.service.js";
import { db, tables} from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid job ID'
    })
  }

  const job = await getJobById(db, tables, parseInt(id))

  return job
})
