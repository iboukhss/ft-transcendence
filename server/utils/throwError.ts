export function throw500(statusMessage: string) {
  throw createError({
    statusCode: 500,
    message: 'Internal server error',
    statusMessage: statusMessage
  })
}

export function throw400(statusMessage: string) {
  throw createError({
    statusCode: 400,
    message: 'Bad Request',
    statusMessage: statusMessage
  })
}

export function throw401(statusMessage: string) {
  throw createError({
    statusCode: 401,
    message: 'Unauthorized',
    statusMessage: statusMessage
  })
}

export function throw403(statusMessage: string) {
  throw createError({
    statusCode: 403,
    message: 'Forbidden',
    statusMessage: statusMessage
  })
}

export function throw404(statusMessage: string) {
  throw createError({
    statusCode: 404,
    message: 'Not found or not allowed',
    statusMessage: statusMessage
  })
}

export function throw429(statusMessage: string) {
  throw createError({
    statusCode: 429,
    message: 'Too Many Requests',
    statusMessage: statusMessage
  })
}
