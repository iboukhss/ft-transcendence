import type {
  COUNTRY_KEYS,
  JOB_CATEGORY_KEYS,
  SKILL_KEYS,
  WORKPLACE_KEYS,
  ACCOUNT_TYPE_KEYS
} from '#shared/constants/enums'

export const COUNTRY_LABELS: Record<typeof COUNTRY_KEYS[number], string> = {
  be: 'Belgium',
  de: 'Germany',
  fr: 'France',
  lu: 'Luxembourg'
} as const

export const JOB_CATEGORY_LABELS: Record<typeof JOB_CATEGORY_KEYS[number], string> = {
  cybersecurity: 'Cybersecurity',
  devops: 'DevOps',
  network_engineering: 'Network Engineering',
  software_development: 'Software Development',
  web_development: 'Web Development',
  other: 'Other'
} as const

export const SKILL_LABELS: Record<typeof SKILL_KEYS[number], string> = {
  c: 'C',
  cobol: 'COBOL',
  cpp: 'C++',
  csharp: 'C#',
  css: 'CSS',
  dart: 'Dart',
  golang: 'Go',
  html: 'HTML',
  java: 'Java',
  javascript: 'JavaScript',
  kotlin: 'Kotlin',
  lua: 'Lua',
  php: 'PHP',
  python: 'Python',
  r: 'R',
  ruby: 'Ruby',
  rust: 'Rust',
  scala: 'Scala',
  sql: 'SQL',
  swift: 'Swift',
  typescript: 'TypeScript'
} as const

export const WORKPLACE_LABELS: Record<typeof WORKPLACE_KEYS[number], string> = {
  on_site: 'On site',
  remote: 'Remote',
  hybrid: 'Hybrid'
} as const

export const ACCOUNT_TYPE_INFO: Record<typeof ACCOUNT_TYPE_KEYS[number], { label: string, description: string }> = {
  freelancer: {
    label: 'Freelancer',
    description: 'I am looking for a job opportunity.'
  },
  company: {
    label: 'Company',
    description: 'I am looking to hire someone.'
  }
} as const
