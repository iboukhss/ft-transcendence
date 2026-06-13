import type { JobDTO } from '#shared/dto/job.dto.js'

export function useSalaryFilter() {
  const selectedSalary = ref<number[]>([])

  function verifySalaryCheckboxes(items: JobDTO[]): JobDTO[] {
    if (selectedSalary.value.length === 0) {
      return items
    }

    return items.filter((item) => {
      return item.hourlyRate >= selectedSalary.value
    })
  }
  return {
    selectedSalary,
    verifySalaryCheckboxes
  }
}
