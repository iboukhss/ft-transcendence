import type { JobDTO } from '#shared/dto/job.dto.js'

export function useCategoriesFilter() {
  const selectedCategories = ref<string[]>([])

  function verifyCategoryCheckboxes(items: JobDTO[]): JobDTO[] {
    if (selectedCategories.value.length === 0) {
      return items
    }

    return items.filter((item) => {
      return selectedCategories.value.includes(item.category)
    })
  }
  return {
    selectedCategories,
    verifyCategoryCheckboxes
  }
}
