<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  title: 'About Us',
  meta: [
    { name: 'description', content: 'Sejarah dan Visi Misi Pramuka SMA Negeri 1 Pasawahan.' }
  ]
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-card pt-10">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
      <!-- Header -->
      <div class="pb-16 border-b border-border text-center">
        <h1 class="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">Our Heritage</h1>
        <p class="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Berdiri kuat sebagai pilar penempa karakter pemuda, Gerakan Pramuka SMA Negeri 1 Pasawahan menyatukan cipta, rasa, dan karsa sedari puluhan tahun.
        </p>
      </div>

      <!-- Core Details -->
      <div class="py-24 grid lg:grid-cols-12 gap-16 items-start border-b border-border">
        <div class="lg:col-span-4 sticky top-32">
          <h2 class="font-display text-3xl font-bold text-foreground">A Brief History</h2>
          <div class="mt-6 w-12 h-1 bg-primary rounded-full"></div>
        </div>
        <div class="lg:col-span-8 prose prose-lg prose-neutral dark:prose-invert">
          <p class="text-lg leading-relaxed text-foreground/90">
            Awal mula berdirinya pangkalan SMA Negeri 1 Pasawahan tak lepas dari semangat para pendahulu yang menginginkan sebuah wadah positif penempa kedisiplinan dan mental.
          </p>
          <p class="text-lg leading-relaxed text-foreground/90 mt-6">
            Dari tahun ke tahun, ambalan ini terus berkembang, baik secara kualitas anggota maupun kuantitas keikutsertaan dalam berbagai lomba tingkat cabang hingga daerah. Berbekal Tri Satya dan Dasa Darma, kami senantiasa berperan aktif membaktikan diri di tengah masyarakat.
          </p>
          <blockquote class="my-10 pl-6 border-l-4 border-primary italic text-2xl font-display text-muted-foreground font-medium">
            "Kami tidak hanya diajarkan cara mengikat tali, tapi bagaimana cara mengikat persaudaraan yang tak akan pernah putus."
          </blockquote>
        </div>
      </div>

      <!-- Vision Mission -->
      <div class="py-24 grid lg:grid-cols-2 gap-16">
        <div class="bg-background p-10 md:p-14 rounded-sm border border-border shadow-sm">
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-8">
            <span class="text-primary font-bold text-xl">V</span>
          </div>
          <h3 class="font-display text-2xl font-bold text-foreground mb-6">Visi Ambalan</h3>
          <p class="text-lg text-muted-foreground leading-relaxed">
            Terwujudnya kader Pramuka Penegak yang berbudi pekerti luhur, berkarakter kuat, mandiri, peduli lingkungan, dan berpegang teguh pada nilai-nilai Pancasila dalam menyongsong era globalisasi.
          </p>
        </div>

        <div class="bg-background p-10 md:p-14 rounded-sm border border-border shadow-sm">
          <div class="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-8">
            <span class="text-accent font-bold text-xl">M</span>
          </div>
          <h3 class="font-display text-2xl font-bold text-foreground mb-6">Misi Ambalan</h3>
          <ul class="space-y-4 text-lg text-muted-foreground list-disc list-inside">
            <li>Menyelenggarakan latihan rutin yang inovatif, edukatif, dan rekreatif.</li>
            <li>Meningkatkan kualitas keterampilan manajerial dan kepemimpinan.</li>
            <li>Menumbuhkan kesadaran pelestarian alam lewat kegiatan kemah bakti.</li>
            <li>Mempererat tali persaudaraan antar anggota.</li>
          </ul>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="py-24 text-center">
        <p class="text-2xl font-display text-foreground font-semibold mb-8">Be part of our ongoing story.</p>
        <NuxtLink to="/contact" class="inline-flex h-14 items-center justify-center rounded-sm bg-primary px-10 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90">
          Join Application
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
