// get all applications of the current user
import { getOffersJob } from '#server/services/offers/get-offers-job.service.js'
import { db, tables } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  requireCompany(session.user)

  const jobId = getRouterParamAsNumber(event)

  return (
    await getOffersJob(
      db,
      tables,
      jobId,
      session.user.id,
      session.user.accountType as 'freelancer' | 'company' | 'admin'
    )
  )
})
