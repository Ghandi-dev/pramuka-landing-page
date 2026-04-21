<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  title: 'Contact & Join',
  meta: [
    { name: 'description', content: 'Hubungi kami atau bergabung bersama Pramuka SMAN 1 Pasawahan.' }
  ]
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background">
    <!-- Header -->
    <header class="bg-card py-24 border-b border-border">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
        <h1 class="font-display text-5xl md:text-7xl font-bold text-foreground mb-6">Reach Out</h1>
        <p class="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Baik untuk menjalin silaturahmi, pertanyaan mengenai kolaborasi, atau mendaftar menjadi anggota baru. Kami
          siap menyambut Anda.
        </p>
      </div>
    </header>

    <section class="py-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl grid md:grid-cols-2 gap-16 lg:gap-24">

        <!-- Contact Info -->
        <div>
          <h2 class="font-display text-3xl font-bold text-foreground mb-8">Base Camp</h2>

          <div class="space-y-10">
            <div>
              <p class="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Location</p>
              <p class="text-lg text-foreground font-medium">Sanggar Pramuka SMAN 1 Pasawahan</p>
              <p class="text-foreground/80 mt-1">Jl. Kapten Halim No.1, Pasawahan,<br />Kab. Purwakarta, Jawa Barat
                41172</p>
            </div>

            <div>
              <p class="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Electronic Mail</p>
              <a href="mailto:pramuka@sman1pasawahan.sch.id"
                class="text-lg text-primary hover:underline font-medium">pramuka@sman1pasawahan.sch.id</a>
            </div>

            <div>
              <p class="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Digital Frequency</p>
              <div class="flex gap-4 pt-4">
              <a href="https://www.instagram.com/pramukasmanpas" target="_blank" aria-label="Instagram"
                class="text-muted-foreground hover:text-accent transition-colors">
                <img src="/social/instagram.svg" alt="Instagram" class="w-5 h-5">
              </a>
              <a href="https://www.facebook.com/share/g/14aXL3TXarD/" aria-label="Facebook" target="_blank"
                class="text-muted-foreground hover:text-accent transition-colors">
                <img src="/social/facebook.svg" alt="Facebook" class="w-5 h-5">
              </a>

              <a href="https://youtube.com/@sman1pasawahan?si=0F5FrQRrsHbuGmhQ" target="_blank" aria-label="YouTube"
                class="text-muted-foreground hover:text-accent transition-colors">
                <img src="/social/youtube.svg" alt="YouTube" class="w-5 h-5">
              </a>

              <a href="https://www.tiktok.com/@sman1pasawahanpwk?_r=1&_t=ZS-95cHcPuMxEK" target="_blank"
                aria-label="TikTok" class="text-muted-foreground hover:text-accent transition-colors">
                <img src="/social/tiktok.svg" alt="TikTok" class="w-5 h-5">
              </a>
            </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-card p-8 md:p-10 rounded-sm border border-border shadow-sm">
          <h2 class="font-display text-2xl font-bold text-foreground mb-8">Send a Dispatch</h2>

          <form class="space-y-6" @submit.prevent>
            <div class="space-y-2">
              <label for="name" class="text-sm font-medium text-foreground">Full Name</label>
              <input type="text" id="name"
                class="flex h-12 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                placeholder="e.g. John Doe" />
            </div>

            <div class="space-y-2">
              <label for="email" class="text-sm font-medium text-foreground">Email Address</label>
              <input type="email" id="email"
                class="flex h-12 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                placeholder="your@email.com" />
            </div>

            <div class="space-y-2">
              <label for="topic" class="text-sm font-medium text-foreground">Subject of Inquiry</label>
              <select id="topic"
                class="flex h-12 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors">
                <option value="join">Join Membership</option>
                <option value="collab">Event Collaboration</option>
                <option value="general">General Question</option>
              </select>
            </div>

            <div class="space-y-2">
              <label for="message" class="text-sm font-medium text-foreground">Message</label>
              <textarea id="message" rows="5"
                class="flex w-full rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors resize-none"
                placeholder="State your purpose here..."></textarea>
            </div>

            <button type="submit"
              class="inline-flex h-12 w-full items-center justify-center rounded-sm bg-primary px-8 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 mt-4">
              Transmit Message
            </button>
          </form>
        </div>

      </div>
    </section>
  </div>
</template>
