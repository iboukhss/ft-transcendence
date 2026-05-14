import type { H3Event } from 'h3'

export function getRouterParamAsNumber(event: H3Event, paramName: string = 'id'): number {
  const param = getRouterParam(event, paramName)
  const parsedNumber = Number(param)

  if (!param || isNaN(parsedNumber)) {
    throw createError({
      statusCode: 400,
      statusMessage: `URL parameter "${paramName}" must be a valid number.`
    })
  }

  return parsedNumber
}
