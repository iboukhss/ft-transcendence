export default defineNuxtRouteMiddleware((to) => {
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
