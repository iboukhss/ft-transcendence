import type { DBJob } from '#server/utils/db'
import type { JobResponseDTO } from '#shared/dto/job.dto'

export function toJobDTO(job: DBJob): JobResponseDTO {
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    category: job.category,
    skills: job.skills,
    hourlyRate: job.hourlyRate,
    duration: job.duration,
    workplace: job.workplace,
    location: job.location,
    status: job.status,
    createdAt: (job.updatedAt instanceof Date ? job.updatedAt : new Date()).toISOString(),
    updatedAt: (job.updatedAt instanceof Date ? job.updatedAt : new Date()).toISOString()
  }
}

export function toJobsResponseDTO(jobs: DBJob[]) {
  if (!jobs || jobs.length === 0) return []
  return jobs.map(job => toJobDTO(job))
}
