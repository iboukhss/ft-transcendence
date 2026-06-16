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

    return items.filter((item) => {
      return selectedLocations.value.includes(item.country || item.location)
    })
  }
  return {
    selectedLocations,
    verifyLocationCheckboxes
  }
}
