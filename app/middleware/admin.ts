export default defineNuxtRouteMiddleware(async () => {
  const { user, fetch } = useUserSession()

  await fetch()

  // Return 404 instead of 403 — page appears not to exist for non-admins
  if (!user.value || user.value.role !== 'admin') {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }
})
