<script setup lang="ts">
const toast = useToast()
const { user } = useUserSession()
const isExporting = ref(false)
const exportFormat = ref<'json' | 'csv' | 'xml'>('json')

const formatOptions = [
  { label: 'JSON', value: 'json' },
  { label: 'CSV', value: 'csv' },
  { label: 'XML', value: 'xml' }
]

const contactState = reactive({
  subject: '',
  message: ''
})

const subjectOptions = [
  { label: 'Right to rectification (Art. 16 GDPR) — correct inaccurate or incomplete data', value: 'Art. 16 GDPR - Right to rectification' },
  { label: 'Right to erasure (Art. 17 GDPR) — right to be forgotten', value: 'Art. 17 GDPR - Right to erasure' },
  { label: 'Right to restriction of processing (Art. 18 GDPR)', value: 'Art. 18 GDPR - Right to restriction of processing' },
  { label: 'Right to object (Art. 21 GDPR) — object to processing based on legitimate interests', value: 'Art. 21 GDPR - Right to object' },
  { label: 'Right to withdraw consent', value: 'Withdrawal of consent' }
]

// --- format converters -------------------------------------------------

function escapeCsvValue(value: any): string {
  if (value === null || value === undefined) return ''
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function toCsv(data: Record<string, any>): string {
  const sections: string[] = []

  for (const [sectionName, sectionData] of Object.entries(data)) {
    sections.push(`# ${sectionName}`)

    if (Array.isArray(sectionData)) {
      if (sectionData.length === 0) {
        sections.push('(no entries)')
      }
      else {
        const headers = Object.keys(sectionData[0])
        sections.push(headers.join(','))
        for (const row of sectionData) {
          sections.push(headers.map(h => escapeCsvValue(row[h])).join(','))
        }
      }
    }
    else if (sectionData && typeof sectionData === 'object') {
      const headers = Object.keys(sectionData)
      sections.push(headers.join(','))
      sections.push(headers.map(h => escapeCsvValue(sectionData[h])).join(','))
    }
    else {
      sections.push(escapeCsvValue(sectionData))
    }

    sections.push('')
  }

  return sections.join('\n')
}

function escapeXml(value: any): string {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function valueToXml(value: any, tagName: string): string {
  if (Array.isArray(value)) {
    return value.map(item => valueToXml(item, tagName)).join('')
  }
  if (value && typeof value === 'object') {
    const inner = Object.entries(value)
      .map(([k, v]) => valueToXml(v, k))
      .join('')
    return `<${tagName}>${inner}</${tagName}>`
  }
  return `<${tagName}>${escapeXml(value)}</${tagName}>`
}

function toXml(data: Record<string, any>): string {
  const body = Object.entries(data)
    .map(([key, value]) => valueToXml(value, key))
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<export>${body}</export>`
}

function buildExportFile(data: Record<string, any>, format: 'json' | 'csv' | 'xml') {
  if (format === 'csv') {
    return { content: toCsv(data), mime: 'text/csv', ext: 'csv' }
  }
  if (format === 'xml') {
    return { content: toXml(data), mime: 'application/xml', ext: 'xml' }
  }
  return { content: JSON.stringify(data, null, 2), mime: 'application/json', ext: 'json' }
}

// --- export --------------------------------------------------------------

async function onExportData() {
  if (isExporting.value) return
  isExporting.value = true

  try {
    const [account, profile, bookings] = await Promise.allSettled([
      $fetch('/api/account'),
      $fetch('/api/profile'),
      $fetch('/api/bookings')
    ])

    const isFreelancer = user.value?.accountType === 'freelancer'

    const [offers, jobs, contracts] = await Promise.allSettled([
      $fetch('/api/offers'),
      isFreelancer ? Promise.resolve(null) : $fetch('/api/jobs', { query: { companyId: user.value?.id } }),
      isFreelancer ? $fetch('/api/profiles/freelancer-contracts') : Promise.resolve(null)
    ])

    const exportData: Record<string, any> = {
      exported_at: new Date().toISOString(),
      account: account.status === 'fulfilled' ? account.value : null,
      profile: profile.status === 'fulfilled' ? profile.value : null,
      bookings: bookings.status === 'fulfilled' ? bookings.value : null,
      offers: offers.status === 'fulfilled' ? offers.value : null,
      jobs: jobs.status === 'fulfilled' ? jobs.value : null,
      contracts: contracts.status === 'fulfilled' ? contracts.value : null
    }

    Object.keys(exportData).forEach((k) => {
      if (exportData[k] === null) delete exportData[k]
    })

    const { content, mime, ext } = buildExportFile(exportData, exportFormat.value)

    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `luxlink-data-export-${new Date().toISOString().slice(0, 10)}.${ext}`
    a.click()
    URL.revokeObjectURL(url)

    toast.add({
      title: 'Export successful',
      description: `Your data has been downloaded as ${exportFormat.value.toUpperCase()}.`,
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
  }
  catch (err: any) {
    toast.add({
      title: 'Export failed',
      description: err.data?.message || 'Something went wrong while exporting your data.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
  finally {
    isExporting.value = false
  }
}

function onContactSubmit() {
  if (!contactState.subject || !contactState.message.trim()) {
    toast.add({
      title: 'Incomplete form',
      description: 'Please select a subject and write a message.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
    return
  }

  const mailto = `mailto:contact@luxlink.lu?subject=${encodeURIComponent(contactState.subject)}&body=${encodeURIComponent(contactState.message)}`
  window.location.href = mailto
}
</script>

<template>
  <UPageBody class="space-y-8">
    <div class="px-2 text-3xl font-bold tracking-tight">
      <h1>Data & Privacy</h1>
    </div>

    <UCard
      title="Export your data"
      description="Download a copy of all personal data LuxLink holds about you, in accordance with your right to data portability (Art. 20 GDPR)."
    >
      <UFormField label="Format">
        <USelect
          v-model="exportFormat"
          :items="formatOptions"
          value-key="value"
          class="w-40"
        />
      </UFormField>

      <template #footer>
        <UButton
          label="Download my data"
          variant="outline"
          icon="i-lucide-download"
          :loading="isExporting"
          @click="onExportData"
        />
      </template>
    </UCard>

    <UCard
      title="Exercise your rights"
      description="Submit a request to our team regarding your personal data. We will respond within 30 days as required by GDPR."
    >
      <div class="space-y-4">
        <UFormField label="Subject" name="subject">
          <USelect
            v-model="contactState.subject"
            :items="subjectOptions"
            value-key="value"
            placeholder="Select a right to exercise..."
            :ui="{ content: 'min-w-fit' }"
          />
        </UFormField>

        <UFormField label="Message" name="message">
          <UTextarea
            v-model="contactState.message"
            :rows="5"
            placeholder="Please describe your request in detail..."
          />
        </UFormField>
      </div>

      <template #footer>
        <UButton
          label="Send request"
          variant="outline"
          icon="i-lucide-send"
          @click="onContactSubmit"
        />
      </template>
    </UCard>
  </UPageBody>
</template>
