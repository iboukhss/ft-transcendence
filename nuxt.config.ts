// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', 'nuxt-auth-utils'],
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15',

  typescript: {
    typeCheck: true,
    strict: true,
    includeWorkspace: true
  },

  // Reference
  // https://eslint.style/rules
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: false,
        commaDangle: 'never'
      }
    }
  }
})
