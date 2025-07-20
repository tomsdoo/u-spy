import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/u-spy/',
  lang: 'en-US',
  title: "u-spy",
  description: "utility for me",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' }
    ],

    sidebar: [
      {
        text: 'contents',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Interceptions', link: '/interceptions' },
          { text: 'Mockings', link: '/mockings' },
          { text: 'Hot Strokes', link: '/hot-strokes' },
          { text: 'Store', link: '/store' },
          { text: 'Ephemeral Messages', link: '/ephemeral-messages' },
          { text: 'Custom Elements', link: '/custom-elements' },
          { text: 'Custom Iterator', link: '/custom-iterator' },
          { text: 'Replacings', link: '/replacings' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tomsdoo/u-spy' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/u-spy' },
    ]
  }
})
