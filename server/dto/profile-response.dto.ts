export function toProfileResponseDTO(profile: any) {
  return {

    firstName: profile.firstName,

    lastName: profile.lastName,

    houseNumber: profile.houseNumber,

    street: profile.street,

    zip: profile.zip,

    country: profile.country,

    language: profile.language
  }
}
