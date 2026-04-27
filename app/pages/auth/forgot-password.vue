<script setup lang="ts">
import { Mail, Loader2, CheckCircle2, ArrowLeft, Send } from "lucide-vue-next";

definePageMeta({
  layout: false,
  auth: false
})

const email = ref("");
const loading = ref(false);
const status = ref<'form' | 'success' | 'error'>('form');
const message = ref("");

const handleForgot = async () => {
  loading.value = true;
  status.value = 'form';
  message.value = "";

  try {
    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    });
    status.value = 'success';
    message.value = response.message || "Instruksi reset password telah dikirim ke email Anda.";
  } catch (err: any) {
    status.value = 'error';
    message.value = err.data?.statusMessage || "Gagal mengirim permintaan reset.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-card border border-border/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <div class="text-center mb-8">
          <div class="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <Mail class="w-8 h-8 text-primary" />
          </div>
          <h1 class="text-2xl font-display font-bold">Lupa Password?</h1>
          <p class="text-muted-foreground mt-2">Jangan khawatir, kami akan mengirimkan instruksi reset.</p>
        </div>

        <div v-if="status === 'success'" class="text-center">
          <div class="flex justify-center mb-4">
            <CheckCircle2 class="w-12 h-12 text-green-500" />
          </div>
          <p class="text-foreground mb-8">{{ message }}</p>
          <NuxtLink to="/auth/login"
            class="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-muted text-foreground border border-border rounded-xl font-medium transition-all hover:bg-muted/80">
            <ArrowLeft class="w-4 h-4" />
            Kembali ke Login
          </NuxtLink>
        </div>

        <form v-else @submit.prevent="handleForgot" class="space-y-4">
          <!-- Alert Message -->
          <div v-if="message" :class="[
            'p-3 rounded-lg text-sm border',
            status === 'error' ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-muted border-border text-muted-foreground'
          ]">
            {{ message }}
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Email Terdaftar</label>
            <input v-model="email" type="email"
              class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="nama@email.com" required :disabled="loading" />
          </div>

          <button type="submit"
            class="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
            :disabled="loading">
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            <Send v-else class="w-4 h-4" />
            {{ loading ? 'Mengirim...' : 'Kirim Instruksi' }}
          </button>

          <div class="text-center pt-2">
            <NuxtLink to="/auth/login"
              class="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
              <ArrowLeft class="w-3 h-3" />
              Kembali ke Login
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
