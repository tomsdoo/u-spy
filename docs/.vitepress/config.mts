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
      },
      {
        text: 'migrations',
        items: [
          { text: 'v0.4.0 to v0.5.0', link: '/migrations/v0.4.0-to-v0.5.0' },
          { text: 'v0.5.0 to v0.6.0', link: '/migrations/v0.5.0-to-v0.6.0' },
          { text: 'v0.6.0 to v0.7.0', link: '/migrations/v0.6.0-to-v0.7.0' },
          { text: 'v0.7.0 to v0.8.0', link: '/migrations/v0.7.0-to-v0.8.0' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tomsdoo/u-spy' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/u-spy' },
    ]
  }
})
