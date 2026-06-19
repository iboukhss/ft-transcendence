// NOTE(isma): This is very vibecoded (but it works!)

export default defineAppConfig({
  ui: {
    // https://ui.nuxt.com/docs/components/avatar#theme
    avatar: {
      variants: {
        size: {
          '4xl': { root: 'size-24 text-4xl' },
          '5xl': { root: 'size-48 text-5xl' }
        }
      }
    },
    // https://ui.nuxt.com/docs/components/chip#theme
    chip: {
      variants: {
        size: {
          '4xl': 'h-[13px] min-w-[13px] text-[13px]'
        }
      },
      compoundVariants: [
        {
          size: '4xl',
          position: 'top-left',
          inset: true,
          class: 'translate-x-1/2 translate-y-1/2 transform'
        },
        {
          size: '4xl',
          position: 'top-right',
          inset: true,
          class: '-translate-x-1/2 translate-y-1/2 transform'
        },
        {
          size: '4xl',
          position: 'bottom-right',
          inset: true,
          class: '-translate-x-1/2 -translate-y-1/2 transform'
        },
        {
          size: '4xl',
          position: 'bottom-left',
          inset: true,
          class: 'translate-x-1/2 -translate-y-1/2 transform'
        }
      ]
    },
    card: {
      slots: {
        root: 'divide-none'
      }
    },
    // Julien: this last block shows the page sidebar (filters, settings nav, etc.) on all screen
    // sizes instead of only on desktop (lg: and up). For the mobile [EVAL] .
    pageAside: {
      slots: {
        root: 'block overflow-y-auto lg:max-h-[calc(100vh-var(--ui-header-height))] lg:sticky lg:top-(--ui-header-height) py-8 lg:ps-4 lg:-ms-4 lg:pe-6.5'
      }
    }
  }
})
