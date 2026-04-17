// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    vite: {
        optimizeDeps: {
            include: [
                '@panzoom/panzoom',
            ]
        }
    },
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", '@nuxtjs/i18n'],
    i18n: {
    locales: [
      { code: 'en', language: 'en-US',file: 'en.json' },
      { code: 'id', language: 'id-ID',file: 'id.json' }
    ],
    defaultLocale: 'id'
  },
    app: {
        head: {
            titleTemplate: '%s - Pramuka SMA Negeri 1 Pasawahan',
            link: [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Outfit:wght@100..900&display=swap' }
            ]
        }
    },
    shadcn: {
        /**
         * Prefix for all the imported component.
         * @default "Ui"
         */
        prefix: "",
        /**
         * Directory that the component lives in.
         * Will respect the Nuxt aliases.
         * @link https://nuxt.com/docs/api/nuxt-config#alias
         * @default "@/components/ui"
         */
        componentDir: "@/components/ui",
    },
});