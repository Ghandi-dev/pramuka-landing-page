<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'

// JSON-LD Structured Data — Organization Schema
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Pramuka SMA Negeri 1 Pasawahan",
        "alternateName": "Gerakan Pramuka Gudep SMAN 1 Pasawahan",
        "url": "https://pramukasmanpas.vercel.app",
        "logo": "https://pramukasmanpas.vercel.app/images/logo.webp",
        "email": "pramukasmanpas@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Jl. Kapten Halim No.1, Pasawahan",
          "addressLocality": "Purwakarta",
          "addressRegion": "Jawa Barat",
          "postalCode": "41172",
          "addressCountry": "ID"
        },
        "sameAs": [
          "https://www.instagram.com/pramukasmanpas",
          "https://www.facebook.com/share/g/14aXL3TXarD/",
          "https://youtube.com/@sman1pasawahan",
          "https://www.tiktok.com/@sman1pasawahanpwk"
        ]
      })
    }
  ]
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
    <AppHeader />
    
    <main class="flex-1 w-full pt-20">
      <!-- Added top padding (pt-20) to account for fixed header -->
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
