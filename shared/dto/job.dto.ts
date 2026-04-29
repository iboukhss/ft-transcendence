import { z } from 'zod'

import { JOB_CATEGORY_KEYS, WORKPLACE_KEYS, SKILL_KEYS, COUNTRY_KEYS, OFFER_STATUS_KEYS } from '#shared/constants/enums'

export const jobSchema = z.object({
  title: z.string().min(1, 'Must provide a job title'),
  description: z.string().min(30, 'Description is too short'),
  category: z.enum(JOB_CATEGORY_KEYS, 'Please select a category'),
  skills: z.array(z.enum(SKILL_KEYS)).min(1, 'Please select at least one skill'),
  hourlyRate: z.number().positive('Rate must be positive'),
  duration: z.number().int().min(1, 'Please indicate the mission\'s duration').max(12),
  workplace: z.enum(WORKPLACE_KEYS, 'Please select a workplace'),
  location: z.enum(COUNTRY_KEYS, 'Please select a location'),
  status: z.enum(OFFER_STATUS_KEYS, 'Please select a status')
})

export type JobDTO = z.infer<typeof jobSchema>
