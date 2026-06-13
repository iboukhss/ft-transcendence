interface hasSkills {
  skills: string[]
}

export function useSkillsFilter() {
  const selectedSkills = ref<string[]>([])

  function verifySkillCheckboxes<T extends hasSkills>(items: T[]): T[] {
    if (selectedSkills.value.length === 0) {
      return items
    }

    return items.filter((freelancer) => {
      const skills = freelancer.skills || []
      return selectedSkills.value.every(skillKey => skills.includes(skillKey))
    })
  }
  return {
    selectedSkills,
    verifySkillCheckboxes
  }
}
