export default defineNuxtRouteMiddleware((to) => {
  // Possible fix for seeding failures on 42 clusters? Should not hurt but you never know.
  // Check here: https://localhost:3001/api/db/seed?token=eval-secret-123
  if (to.path.startsWith('/api')) {
    return
  }

  if (
    to.path === '/'
    || to.path.startsWith('/public')
    || to.path.startsWith('/login')
    || to.path.startsWith('/register')
    || to.path.startsWith('/privacy')
    || to.path.startsWith('/terms')
  ) {
    return
  }

  const { loggedIn, user } = useUserSession()

  if (!loggedIn.value || !user.value) {
    return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`)
  }

  if (to.path.startsWith('/admin') && user.value.role !== 'admin') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found'
    })
  }

  if (to.path.startsWith('/company') && user.value.accountType !== 'company') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found'
    })
  }

  if (to.path.startsWith('/freelancer') && user.value.accountType !== 'freelancer') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found'
    })
  }
})
