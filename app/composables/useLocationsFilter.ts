interface hasCountry {
  country?: string
  location?: string
}

export function useLocationsFilter() {
  const selectedLocations = ref<string[]>([])

  function verifyLocationCheckboxes<T extends hasCountry>(items: T[]): T[] {
    if (selectedLocations.value.length === 0) {
      return items
    }

    return items.filter((freelancer) => {
      return selectedLocations.value.includes(freelancer.country)
    })
  }
  return {
    selectedLocations,
    verifyLocationCheckboxes
  }
}
