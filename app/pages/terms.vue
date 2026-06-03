<script setup lang="ts">
useHead({
  title: 'Terms of Service – LuxLink',
  meta: [{ name: 'description', content: 'Terms of Service for LuxLink, a freelance services platform governed by Luxembourg law.' }]
})

const lastUpdated = '3 June 2026'
</script>

<template>
  <UContainer class="py-12 max-w-3xl">

    <div class="mb-10">
      <h1 class="text-3xl font-bold mb-2">Terms of Service</h1>
      <p class="text-muted text-sm">Last updated: {{ lastUpdated }}</p>
    </div>

    <div class="prose prose-sm dark:prose-invert max-w-none space-y-8">

      <!-- 1. Introduction -->
      <section>
        <h2 class="text-xl font-semibold mb-3">1. Introduction and Acceptance</h2>
        <p>
          These Terms of Service ("Terms") govern your access to and use of the LuxLink platform ("the Platform"),
          a freelance services marketplace developed as a student project at 42 Luxembourg. LuxLink connects
          clients ("Clients") seeking professional services with independent service providers ("Freelancers").
        </p>
        <p class="mt-2">
          By creating an account or using the Platform, you acknowledge that you have read, understood, and agree
          to be bound by these Terms. If you do not agree, please do not use the Platform.
        </p>
        <p class="mt-2">
          These Terms are governed by Luxembourg law, in particular:
        </p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>The Luxembourg Code of Commerce</li>
          <li>The Luxembourg Law of 14 August 2000 on electronic commerce, as amended</li>
          <li>The Luxembourg Consumer Protection Law and applicable EU consumer directives</li>
          <li>EU Directive 2000/31/EC on electronic commerce (implemented in Luxembourg law)</li>
        </ul>
      </section>

      <!-- 2. Eligibility -->
      <section>
        <h2 class="text-xl font-semibold mb-3">2. Eligibility</h2>
        <p>To use LuxLink you must:</p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>Be at least 18 years of age</li>
          <li>Have the legal capacity to enter into binding agreements under applicable law</li>
          <li>Not be prohibited from using the Platform under any applicable law or prior ban</li>
        </ul>
        <p class="mt-2">
          By registering, you represent and warrant that you meet these requirements.
        </p>
      </section>

      <!-- 3. Account -->
      <section>
        <h2 class="text-xl font-semibold mb-3">3. Account Registration and Security</h2>
        <p>
          You must register an account to access most features of the Platform. You agree to:
        </p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>Provide accurate, complete, and current information during registration</li>
          <li>Keep your password confidential and not share your account credentials with third parties</li>
          <li>Notify us immediately at <ULink to="mailto:contact@luxlink.lu">contact@luxlink.lu</ULink> of any unauthorised use of your account</li>
          <li>Be solely responsible for all activity occurring under your account</li>
        </ul>
        <p class="mt-2">
          LuxLink reserves the right to suspend or terminate accounts that provide false information
          or violate these Terms.
        </p>
      </section>

      <!-- 4. Description of services -->
      <section>
        <h2 class="text-xl font-semibold mb-3">4. Description of the Platform and Services</h2>
        <p>
          LuxLink is an intermediary platform that allows:
        </p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Clients</strong> to post job offers and search for qualified freelance professionals</li>
          <li><strong>Freelancers</strong> to create profiles, showcase their skills, and apply to job offers</li>
          <li>Both parties to communicate through the Platform's messaging system</li>
        </ul>
        <p class="mt-2">
          LuxLink acts solely as an intermediary and is not a party to any contract concluded between
          Clients and Freelancers. LuxLink does not guarantee the quality, legality, or completion
          of any services contracted between users.
        </p>
        <p class="mt-2">
          In accordance with Article 4 of the Luxembourg e-Commerce Act implementing EU Directive 2000/31/EC,
          the provision of the Platform as an information society service requires no prior authorisation.
        </p>
      </section>

      <!-- 5. User obligations -->
      <section>
        <h2 class="text-xl font-semibold mb-3">5. User Obligations and Prohibited Conduct</h2>
        <p>You agree to use the Platform lawfully and in good faith. You must not:</p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>Post false, misleading, or fraudulent information in your profile or job listings</li>
          <li>Harass, abuse, threaten, or discriminate against other users</li>
          <li>Attempt to circumvent the Platform to conduct transactions off-platform in a way that deprives LuxLink of its legitimate interests</li>
          <li>Upload or transmit any malicious code, viruses, or harmful content</li>
          <li>Use automated tools (bots, scrapers) to access or collect data from the Platform without prior written consent</li>
          <li>Infringe upon the intellectual property rights of LuxLink or other users</li>
          <li>Violate any applicable Luxembourg, EU, or international law</li>
        </ul>
        <p class="mt-2">
          LuxLink reserves the right to remove content or suspend accounts that violate these rules,
          without prior notice where urgency or severity requires it.
        </p>
      </section>

      <!-- 6. Contracts between users -->
      <section>
        <h2 class="text-xl font-semibold mb-3">6. Contracts Between Clients and Freelancers</h2>
        <p>
          When a Client and a Freelancer agree to work together, they enter into a direct contractual relationship
          governed by their own agreement. LuxLink is not a party to this contract.
        </p>
        <p class="mt-2">
          In accordance with the Luxembourg Law of 14 August 2000 on e-commerce and the EU e-Commerce Directive,
          electronic contracts concluded through the Platform are legally valid. Users are responsible for
          retaining records of their agreements.
        </p>
        <p class="mt-2">
          Any dispute arising from a contract between a Client and a Freelancer is a matter between those parties.
          LuxLink may, at its discretion, assist in mediation but is under no obligation to do so.
        </p>
      </section>

      <!-- 7. Intellectual property -->
      <section>
        <h2 class="text-xl font-semibold mb-3">7. Intellectual Property</h2>
        <p>
          The LuxLink Platform, including its design, source code, logos, and content produced by the LuxLink team,
          is the intellectual property of the LuxLink development team and is protected by applicable Luxembourg
          and EU intellectual property law.
        </p>
        <p class="mt-2">
          Content you publish on the Platform (profile information, job postings, messages) remains your property.
          By posting content, you grant LuxLink a non-exclusive, royalty-free licence to display and use that content
          solely for the purpose of operating the Platform.
        </p>
      </section>

      <!-- 8. Limitation of liability -->
      <section>
        <h2 class="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by Luxembourg law, LuxLink provides the Platform on an "as is" and
          "as available" basis, without warranties of any kind, express or implied.
        </p>
        <p class="mt-2">LuxLink shall not be liable for:</p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>Any dispute, loss, or damage arising from transactions between Clients and Freelancers</li>
          <li>Temporary unavailability of the Platform due to maintenance or technical issues</li>
          <li>Loss of data caused by events beyond our reasonable control</li>
          <li>Indirect or consequential damages arising from use of the Platform</li>
        </ul>
        <p class="mt-2">
          Nothing in these Terms excludes liability for death or personal injury caused by negligence,
          fraud, or any other liability that cannot be excluded under Luxembourg law.
        </p>
      </section>

      <!-- 9. Termination -->
      <section>
        <h2 class="text-xl font-semibold mb-3">9. Account Termination</h2>
        <p>
          You may delete your account at any time via your account settings. Upon deletion, your public
          profile will be removed. Certain data may be retained for the periods described in our
          <ULink to="/privacy" class="font-medium">Privacy Policy</ULink>.
        </p>
        <p class="mt-2">
          LuxLink may suspend or terminate your account if you materially breach these Terms,
          with or without prior notice depending on the severity of the breach.
        </p>
      </section>

      <!-- 10. Modifications -->
      <section>
        <h2 class="text-xl font-semibold mb-3">10. Modifications to These Terms</h2>
        <p>
          LuxLink reserves the right to update these Terms at any time. Changes will be communicated
          to registered users at least 15 days before taking effect, via email or a notice on the Platform.
          Continued use of the Platform after the effective date constitutes acceptance of the revised Terms.
        </p>
      </section>

      <!-- 11. Governing law -->
      <section>
        <h2 class="text-xl font-semibold mb-3">11. Governing Law and Jurisdiction</h2>
        <p>
          These Terms are governed exclusively by the laws of the Grand Duchy of Luxembourg.
          Any dispute arising from or in connection with these Terms that cannot be resolved amicably
          shall be submitted to the exclusive jurisdiction of the courts of Luxembourg City,
          without prejudice to mandatory consumer protection provisions applicable under EU law.
        </p>
      </section>

      <!-- 12. Contact -->
      <section>
        <h2 class="text-xl font-semibold mb-3">12. Contact</h2>
        <p>
          For any questions regarding these Terms, please contact us at
          <ULink to="mailto:contact@luxlink.lu" class="font-medium">contact@luxlink.lu</ULink>.
        </p>
      </section>

    </div>

    <div class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-6 text-sm">
      <ULink to="/privacy" class="text-muted hover:text-primary">Privacy Policy</ULink>
      <ULink to="/" class="text-muted hover:text-primary">Back to Home</ULink>
    </div>

  </UContainer>
</template>
