<script setup lang="ts">
useHead({
  title: 'Privacy Policy – LuxLink',
  meta: [{ name: 'description', content: 'Privacy Policy for LuxLink, a freelance services platform operated under Luxembourg law.' }]
})

const lastUpdated = '3 June 2026'
</script>

<template>
  <UContainer class="max-w-3xl py-12">
    <div class="mb-10">
      <h1 class="mb-2 text-3xl font-bold">Privacy Policy</h1>
      <p class="text-muted text-sm">Last updated: {{ lastUpdated }}</p>
    </div>

    <div class="prose prose-sm dark:prose-invert max-w-none space-y-8">
      <!-- 1. Introduction -->
      <section>
        <h2 class="mb-3 text-xl font-semibold">1. Introduction and Identity of the Data Controller</h2>
        <p>
          LuxLink ("the Platform", "we", "us") is a freelance services marketplace developed as a student project
          at 42 Luxembourg. LuxLink connects clients seeking professional services with freelance talent.
        </p>
        <p class="mt-2">
          This Privacy Policy describes how we collect, process, and protect your personal data in accordance with:
        </p>
        <ul class="mt-2 list-disc space-y-1 pl-5">
          <li>Regulation (EU) 2016/679 of the European Parliament and of the Council (General Data Protection Regulation — <strong>GDPR</strong>)</li>
          <li>The Luxembourg Law of 1 August 2018 on the organisation of the National Commission for Data Protection (<strong>CNPD</strong>) and the general data protection framework</li>
          <li>The Luxembourg Law of 14 August 2000 on electronic commerce, as amended by the Law of 5 July 2004</li>
          <li>The Luxembourg Law of 30 May 2005 relating to the protection of privacy in the electronic communications sector</li>
        </ul>
        <p class="mt-2">
          The data controller responsible for your personal data is the LuxLink team, reachable at:
          <ULink to="mailto:contact@luxlink.lu" class="font-medium">contact@luxlink.lu</ULink>
        </p>
      </section>

      <!-- 2. Data collected -->
      <section>
        <h2 class="mb-3 text-xl font-semibold">2. Personal Data We Collect</h2>
        <p>We collect the following categories of personal data:</p>

        <h3 class="mt-4 mb-1 font-semibold">2.1 Account and Identity Data</h3>
        <ul class="list-disc space-y-1 pl-5">
          <li>Full name and email address (mandatory for registration)</li>
          <li>Password (stored in hashed form — never in plain text)</li>
          <li>Profile information: professional title, skills, biography</li>
          <li>Profile picture (optional)</li>
        </ul>

        <h3 class="mt-4 mb-1 font-semibold">2.2 Transaction and Activity Data</h3>
        <ul class="list-disc space-y-1 pl-5">
          <li>Job offers posted and applications submitted</li>
        </ul>

        <h3 class="mt-4 mb-1 font-semibold">2.3 Technical Data</h3>
        <ul class="list-disc space-y-1 pl-5">
          <li>Session data and authentication tokens</li>
          <li>Date and time of access, pages visited</li>
        </ul>
      </section>

      <!-- 3. Legal basis -->
      <section>
        <h2 class="mb-3 text-xl font-semibold">3. Legal Basis for Processing</h2>
        <p>We process your personal data on the following legal bases under Article 6 GDPR:</p>
        <ul class="mt-2 list-disc space-y-1 pl-5">
          <li><strong>Contract performance (Art. 6(1)(b) GDPR)</strong> — to provide the services you requested when creating an account or posting/applying to jobs</li>
          <li><strong>Legitimate interests (Art. 6(1)(f) GDPR)</strong> — to ensure security, prevent fraud, and improve the Platform</li>
          <li><strong>Legal obligation (Art. 6(1)(c) GDPR)</strong> — to comply with applicable Luxembourg and EU law</li>
          <li><strong>Consent (Art. 6(1)(a) GDPR)</strong> — for any optional processing such as marketing communications, where you have given explicit consent</li>
        </ul>
      </section>

      <!-- 4. Cookies -->
      <section>
        <h2 class="mb-3 text-xl font-semibold">4. Cookies and Trackers</h2>
        <p>
          In accordance with the Luxembourg Law of 30 May 2005 and the ePrivacy Directive (2002/58/EC),
          LuxLink uses only technically necessary cookies required for the functioning of the Platform
          (session management, authentication). We do not use advertising or tracking cookies.
        </p>
        <p class="mt-2">
          Strictly necessary cookies do not require your consent. If we introduce any optional cookies in the future,
          we will request your prior consent in a clear and accessible manner.
        </p>
      </section>

      <!-- 5. Data retention -->
      <section>
        <h2 class="mb-3 text-xl font-semibold">5. Data Retention</h2>
        <p>We retain your personal data for the following periods:</p>
        <ul class="mt-2 list-disc space-y-1 pl-5">
          <li><strong>Account data</strong> — for the duration of your account, plus 1 year after deletion</li>
          <li><strong>Transaction and activity data</strong> — 3 years from the date of the transaction, in line with Luxembourg civil and commercial law</li>
          <li><strong>Technical/security logs</strong> — 12 months</li>
        </ul>
        <p class="mt-2">
          Data will be deleted or anonymised beyond these periods unless a longer retention is required by applicable law.
        </p>
      </section>

      <!-- 6. Data sharing -->
      <section>
        <h2 class="mb-3 text-xl font-semibold">6. Sharing of Personal Data</h2>
        <p>
          LuxLink does not sell your personal data. We may share your data only in the following limited circumstances:
        </p>
        <ul class="mt-2 list-disc space-y-1 pl-5">
          <li><strong>With other users</strong> — profile information you choose to make public (name, skills, portfolio) is visible to other registered users</li>
          <li><strong>With service providers</strong> — technical sub-processors (hosting, database) acting under data processing agreements</li>
          <li><strong>Legal obligations</strong> — when required by Luxembourg or EU law, a court order, or competent authority</li>
        </ul>
        <p class="mt-2">
          No personal data is transferred outside the European Economic Area (EEA) without appropriate safeguards in accordance with Chapter V GDPR.
        </p>
      </section>

      <!-- 7. Your rights -->
      <section>
        <h2 class="mb-3 text-xl font-semibold">7. Your Rights as a Data Subject</h2>
        <p>Under the GDPR and Luxembourg data protection law, you have the following rights:</p>
        <ul class="mt-2 list-disc space-y-1 pl-5">
          <li><strong>Right of access (Art. 15 GDPR)</strong> — obtain a copy of your personal data</li>
          <li><strong>Right to rectification (Art. 16 GDPR)</strong> — correct inaccurate or incomplete data</li>
          <li><strong>Right to erasure (Art. 17 GDPR)</strong> — request deletion of your data ("right to be forgotten")</li>
          <li><strong>Right to restriction of processing (Art. 18 GDPR)</strong></li>
          <li><strong>Right to data portability (Art. 20 GDPR)</strong> — receive your data in a structured, machine-readable format</li>
          <li><strong>Right to object (Art. 21 GDPR)</strong> — object to processing based on legitimate interests</li>
          <li><strong>Right to withdraw consent</strong> — at any time, without affecting prior processing</li>
        </ul>
        <p class="mt-2">
          To exercise any of these rights, contact us at
          <ULink to="mailto:contact@luxlink.lu" class="font-medium">contact@luxlink.lu</ULink>.
          We will respond within 30 days.
        </p>
        <p class="mt-2">
          You also have the right to lodge a complaint with the Luxembourg supervisory authority:
        </p>
        <p class="mt-1 border-l-2 border-gray-300 pl-4 dark:border-gray-600">
          <strong>Commission Nationale pour la Protection des Données (CNPD)</strong><br>
          15, Boulevard du Jazz — L-4370 Belvaux, Luxembourg<br>
          <ULink to="https://cnpd.public.lu" target="_blank" class="font-medium">cnpd.public.lu</ULink>
        </p>
      </section>

      <!-- 8. Security -->
      <section>
        <h2 class="mb-3 text-xl font-semibold">8. Security of Personal Data</h2>
        <p>
          We implement appropriate technical and organisational measures to protect your personal data against
          unauthorised access, loss, or alteration, in accordance with Article 32 GDPR. These measures include
          HTTPS encryption, hashed password storage, and access controls.
        </p>
        <p class="mt-2">
          In the event of a personal data breach likely to result in a risk to your rights and freedoms,
          we will notify the CNPD within 72 hours as required by Article 33 GDPR, and inform affected users
          where required under Article 34 GDPR.
        </p>
      </section>

      <!-- 9. Changes -->
      <section>
        <h2 class="mb-3 text-xl font-semibold">9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any significant changes will be communicated
          to registered users by email or via a notice on the Platform. The date of the last update is
          indicated at the top of this page.
        </p>
      </section>

      <!-- 10. Contact -->
      <section>
        <h2 class="mb-3 text-xl font-semibold">10. Contact</h2>
        <p>
          For any questions regarding this Privacy Policy or our data processing practices,
          please contact us at
          <ULink to="mailto:contact@luxlink.lu" class="font-medium">contact@luxlink.lu</ULink>.
        </p>
      </section>
    </div>

    <div class="mt-12 flex gap-6 border-t border-gray-200 pt-6 text-sm dark:border-gray-700">
      <ULink to="/terms" class="text-muted hover:text-primary">Terms of Service</ULink>
      <ULink to="/" class="text-muted hover:text-primary">Back to Home</ULink>
    </div>
  </UContainer>
</template>
