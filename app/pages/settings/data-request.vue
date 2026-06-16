<script setup lang="ts">
const toast = useToast()
const isExporting = ref(false)

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

async function onExportData() {
  if (isExporting.value) return
  isExporting.value = true

  try {
    const [account, profile, bookings] = await Promise.allSettled([
      $fetch('/api/account'),
      $fetch('/api/profile'),
      $fetch('/api/bookings')
    ])

    const [offers, jobs] = await Promise.allSettled([
      $fetch('/api/offers/freelancer'),
      $fetch('/api/jobs/company')
    ])

    const exportData: Record<string, any> = {
      exported_at: new Date().toISOString(),
      account: account.status === 'fulfilled' ? account.value : null,
      profile: profile.status === 'fulfilled' ? profile.value : null,
      bookings: bookings.status === 'fulfilled' ? bookings.value : null,
      offers: offers.status === 'fulfilled' ? offers.value : null,
      jobs: jobs.status === 'fulfilled' ? jobs.value : null
    }

    // Remove null entries (endpoints that returned 403 for wrong account type)
    Object.keys(exportData).forEach((k) => {
      if (exportData[k] === null) delete exportData[k]
    })

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `luxlink-data-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast.add({
      title: 'Export successful',
      description: 'Your data has been downloaded.',
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
