import type { AccountDTO } from '#shared/dto/account.dto.js'

export interface AccountResponseDTO {
  email: string // table users
  houseNumber: number | null // table profiles
  street: string | null // table profiles
  zip: string | null // table profiles
}

export function toAccountResponseDTO(account: AccountDTO): AccountResponseDTO {
  return {

    email: account.email,
    houseNumber: account.houseNumber,
    street: account.street,
    zip: account.zip
  }
}
