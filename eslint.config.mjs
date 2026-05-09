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
    // NOTE(isma): I have personally found these settings incredibly annoying while editing
    'vue/max-attributes-per-line': 'off',
    'vue/first-attribute-linebreak': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/no-multi-spaces': 'off',

    // Read here: https://perfectionist.dev/rules/sort-imports.html
    'perfectionist/sort-imports': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc'
      }
    ],

    'tailwind/classnames-order': 'warn'
  }
})
