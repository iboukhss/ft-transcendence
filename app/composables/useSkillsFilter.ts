import type { FreelancerDTO } from '#shared/dto/profile.dto.js'

export function useSkillsFilter() {
  const selectedSkills = ref<string[]>([])

  function verifyCheckboxes(freelancers: FreelancerDTO[]): FreelancerDTO[] {
    if (selectedSkills.value.length === 0) {
      return freelancers
    }

    return freelancers.filter((freelancer) => {
      const skills = freelancer.skills || []
      return selectedSkills.value.every(skillKey => skills.includes(skillKey))
  })
  }
  return {
    selectedSkills,
    verifyCheckboxes
  }
}
