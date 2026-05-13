// @ts-check
import perfectionist from 'eslint-plugin-perfectionist'
import tailwind from 'eslint-plugin-tailwindcss'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
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
  }
})
