import { createJob } from '#server/services/jobs/create-job.service.js'
import { validateOrThrow } from '#server/utils/validateOrThrow'
import { createJobSchema } from '#shared/dto/job.dto'

export default defineEventHandler(async (event) => {
  const userId = event.context.auth.user.id

  const body = await readBody(event)
  const result = createJobSchema.safeParse(body)
  const validData = validateOrThrow(result)

  return createJob(userId, validData)
})

defineRouteMeta({
  openAPI: {
    tags: ['v1'],
    description: 'API route used to post a new job',
    security: [{ ApiKeyAuth: [] }],

    // 1. WHAT THE USER MUST SEND (createJobSchema)
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'title',
              'description',
              'category',
              'skills',
              'hourlyRate',
              'duration',
              'workplace',
              'location',
              'status'
            ],
            properties: {
              title: {
                type: 'string',
                minLength: 1,
                example: 'Senior Fullstack Developer'
              },
              description: {
                type: 'string',
                minLength: 30,
                example: 'We are looking for a skilled developer with 5+ years of experience in Nuxt, Nitro, and modern web application development structures.'
              },
              category: {
                type: 'string',
                description: 'Must match valid JOB_CATEGORY_KEYS array string matching backend validation rules.'
              },
              skills: {
                type: 'array',
                minItems: 1,
                items: { type: 'string' },
                example: ['Vue', 'TypeScript', 'Node']
              },
              hourlyRate: {
                type: 'number',
                minimum: 0.01,
                example: 65.50
              },
              duration: {
                type: 'integer',
                minimum: 1,
                maximum: 12,
                example: 6,
                description: 'Mission duration specified in months.'
              },
              workplace: {
                type: 'string',
                description: 'Must match valid WORKPLACE_KEYS (e.g., remote, hybrid, onsite).'
              },
              location: {
                type: 'string',
                description: 'Must match valid COUNTRY_KEYS structure mapping rules.'
              },
              status: {
                type: 'string',
                description: 'Must match valid JOB_STATUS_KEYS array string matching validation logic.'
              }
            }
          } as any
        }
      }
    },

    // 2. WHAT THE SERVER RETURNS ON SUCCESS (jobSchema)
    responses: {
      201: {
        description: 'Job successfully created and registered into database.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 142 },
                title: { type: 'string', example: 'Senior Fullstack Developer' },
                description: { type: 'string', example: 'We are looking for a skilled developer...' },
                category: { type: 'string', example: 'Development' },
                skills: { type: 'array', items: { type: 'string' }, example: ['Vue', 'TypeScript'] },
                hourlyRate: { type: 'number', example: 65.50 },
                duration: { type: 'integer', example: 6 },
                workplace: { type: 'string', example: 'remote' },
                location: { type: 'string', example: 'LU' },
                status: { type: 'string', example: 'active' },
                createdAt: { type: 'string', format: 'date-time', example: '2026-06-14T09:00:00Z' },
                updatedAt: { type: 'string', format: 'date-time', example: '2026-06-14T09:15:30Z' }
              }
            }
          }
        }
      }
    }
  }
})
