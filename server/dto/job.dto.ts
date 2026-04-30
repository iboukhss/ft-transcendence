import type { DBJob } from '#server/utils/db'

export interface JobResponseDTO {
  id: string | number
  title: string
  description: string
  category: string
  skills: string[]
  hourlyRate: number
  duration: number
  workplace: string
  location: string
  status: string
  createdAt: string
  updatedAt: string
}

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
