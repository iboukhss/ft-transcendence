import { z } from 'zod'

import { JOB_CATEGORY_KEYS, WORKPLACE_KEYS, SKILL_KEYS, COUNTRY_KEYS, JOB_STATUS_KEYS } from '#shared/constants/enums'
import { createQueryArray } from '#shared/utils/createQueryArray'

export const createJobSchema = z.object({
  title: z.string().min(1, 'Must provide a job title'),
  description: z.string().min(30, 'Description is too short'),
  category: z.enum(JOB_CATEGORY_KEYS, 'Please select a category'),
  skills: z.array(z.enum(SKILL_KEYS)).min(1, 'Please select at least one skill'),
  hourlyRate: z.number().positive('Rate must be positive').max(500, 'Hourly rate cannot exceed €500'),
  duration: z.number().int().min(1, 'Please indicate the mission\'s duration').max(12),
  workplace: z.enum(WORKPLACE_KEYS, 'Please select a workplace'),
  location: z.enum(COUNTRY_KEYS, 'Please select a location'),
  status: z.enum(JOB_STATUS_KEYS, 'Please select a status')
})

export const jobSchema = createJobSchema.extend({
  id: z.number(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string()
})

export const jobsQuerySchema = z.object({
  companyId: z.coerce.number().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  minSalary: z.coerce.number().optional(),
  maxSalary: z.coerce.number().optional(),
  categories: createQueryArray(JOB_CATEGORY_KEYS).optional().default([]),
  locations: createQueryArray(COUNTRY_KEYS).optional().default([]),
  workplaces: createQueryArray(WORKPLACE_KEYS).optional().default([]),
  skills: createQueryArray(SKILL_KEYS).optional().default([])
})

export type CreateJobDTO = z.infer<typeof createJobSchema>
export type JobDTO = z.infer<typeof jobSchema>
export type JobsQueryDTO = z.infer<typeof jobsQuerySchema>
