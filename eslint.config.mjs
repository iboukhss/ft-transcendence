// @ts-check
import perfectionist from 'eslint-plugin-perfectionist'
import tailwind from 'eslint-plugin-tailwindcss'

import withNuxt from './.nuxt/eslint.config.mjs'

const config = withNuxt({
  plugins: {
    perfectionist,
    tailwind
  },
  rules: {
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/padding-line-between-blocks': 'off',

    // Read here: https://perfectionist.dev/rules/sort-imports.html
    'perfectionist/sort-imports': ['error', {
      type: 'alphabetical',
      order: 'asc'
    }],

    'tailwind/classnames-order': 'warn'
  },
  settings: {
    tailwindcss: {
      config: {}
    }
  }
})

// This is pretty stupid but we have to undo some default ignores.
// https://github.com/nuxt/eslint/issues/453
config.append({
  ignores: [
    '!server/**/public/**',
    '!app/**/public/**',
    '!shared/**/public/**'
  ]
})

export default config
