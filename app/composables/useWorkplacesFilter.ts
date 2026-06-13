import type { JobDTO } from '#shared/dto/job.dto.js'

export function useWorkplacesFilter() {
  const selectedWorkplaces = ref<string[]>([])

  function verifyWorkplaceCheckboxes(items: JobDTO[]): JobDTO[] {
    if (selectedWorkplaces.value.length === 0) {
      return items
    }

    return items.filter((item) => {
      return selectedWorkplaces.value.includes(item.workplace)
    })
  }
  return {
    selectedWorkplaces,
    verifyWorkplaceCheckboxes
  }
}
