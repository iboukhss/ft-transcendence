export function toUserDTO(user: any) {
  return {
    id: user.id,
    email: user.email
  }
}
