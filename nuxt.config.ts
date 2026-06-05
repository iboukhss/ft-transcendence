// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', 'nuxt-auth-utils', '@nuxt/ui'],
  imports: {
    scan: false
  },
  devtools: { enabled: true },
  // From here: https://ui.nuxt.com/docs/getting-started/installation/nuxt
  css: ['~/assets/css/main.css'],
  runtimeConfig: {

    oauth: {
      google: {
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_KEY
      }
    }
  },
  devServer: {
    https: {
      key: './localhost-key.pem',
      cert: './localhost.pem'
    }
  },
  // Stops useAppConfig warning spam
  experimental: {
    serverAppConfig: false
  },
  compatibilityDate: '2026-04-01',
  nitro: {
    experimental: {
      tasks: true
    },
    storage: {
      cache: {
        driver: 'memory'
      },
      uploads: {
        driver: 'fs',
        base: './public/uploads'
      }
    }
  },
  // Disabled typecheck due to random IPC crashes
  typescript: {
    typeCheck: false,
    strict: true,
    includeWorkspace: true
  },
  // Reference: https://eslint.style/rules
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
