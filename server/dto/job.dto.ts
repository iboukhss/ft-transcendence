export function toJobDTO(job: any) {
  if (!job) {
    return null
  }

  return {
    id: job.id,
    title: job.title,
    description: job.description,
    category: job.category,
    skills: job.skills,
    hourlyRate: job.hourlyRate,
    duration: job.duration,
    workPlace: job.workPlace, // Ensure this matches your Zod schema casing
    location: job.location,
    status: job.status,
    // Optional chaining prevents "toISOString of undefined" crashes
    createdAt: job.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: job.updatedAt?.toISOString() ?? new Date().toISOString()
  }
}

export function toJobsResponseDTO(jobs: any[]) {
  if (!jobs || jobs.length === 0) return []
  return jobs.map(job => toJobDTO(job))
}
