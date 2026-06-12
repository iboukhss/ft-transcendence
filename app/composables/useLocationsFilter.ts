import type { FreelancerDTO } from '#shared/dto/profile.dto.js'

export function useLocationsFilter() {
  const selectedLocations = ref<string[]>([])

  function verifyLocationCheckboxes(freelancers: FreelancerDTO[]): FreelancerDTO[] {
    if (selectedLocations.value.length === 0) {
      return freelancers
    }

    return freelancers.filter((freelancer) => {
      return selectedLocations.value.includes(freelancer.country)
    })
  }
  return {
    selectedLocations,
    verifyLocationCheckboxes
  }
}
