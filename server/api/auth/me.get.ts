export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    return {
      loggedIn: true,
      user: session.user
    }
  }
  catch (error) {
    return {
      loggedIn: false
    }
  }
})
