import { getFreelancerContracts } from '#server/services/profile/get-freelancers-contracts.service.js'
import { requireValidUserSession } from '#server/utils/require-valid-user-session'

export default defineEventHandler(async (event) => {
  const session = await requireValidUserSession(event)
  if (session.user.accountType !== 'freelancer') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only freelancers can access this contract endpoint.'
    })
  }
  try {
    return await getFreelancerContracts(db, tables, session.user.id)
  }
  catch (error) {
    console.error('[API Contracts Handler Error]:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error: Failed to load contracts.'
    })
  }
})
