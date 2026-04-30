import type { ZodSafeParseResult } from 'zod'

export function validateOrThrow<T>(result: ZodSafeParseResult<T>): T {
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: result.error.issues
    })
  }
  return result.data
}
