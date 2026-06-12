import { handleOauthUser } from '#server/services/oauth/register.service'
import { db, tables } from '#server/utils/db'

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    if (!user.email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }
    const google_user = await handleOauthUser(db, tables, user)
    await setUserSession(event, {
      user: {
        id: google_user.id,
        accountType: 'freelancer',
        email: user.email,
        role: 'user'
      }
    })
    return sendRedirect(event, '/')
  },

  async onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/?error=auth_failed')
  }
})
