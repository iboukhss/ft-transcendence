import type { User } from '#auth-utils'

export function requireAdmin(user: User) {
  if (user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Admin account required'
    })
  }
}

export function requireCompany(user: User) {
  if (user.accountType !== 'company') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Company account required'
    })
  }
}

export function requireFreelancer(user: User) {
  if (user.accountType !== 'freelancer') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Freelancer account required'
    })
  }
}
