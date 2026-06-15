import type { JobDTO } from '#shared/dto/job.dto.js'

export function useSalaryFilter() {
  const selectedSalary = ref<[number, number]>([1, 500])

  function verifySalarySliders(items: JobDTO[]): JobDTO[] {
    return items.filter((item) => {
      return item.hourlyRate >= selectedSalary.value[0]
        && item.hourlyRate <= selectedSalary.value[1]
    })
  }
  return {
    selectedSalary,
    verifySalarySliders
  }
}
