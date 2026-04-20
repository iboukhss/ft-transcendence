import { requireUser } from '#server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUser(event)

    console.log('You are logged in.', user)

    return {
      loggedIn: true,
      user
    }
  }
  catch (error) {
    console.log('You must log in.')

    return {
      loggedIn: false
    }
  }
})
