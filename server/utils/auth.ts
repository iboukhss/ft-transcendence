export async function requireUser(event: any) {
  // reuse if already resolved
  if (event.context.user) {
    return event.context.user
  }

  const session = await getUserSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // cache user in request context
  event.context.user = session.user

  return session.user
}
