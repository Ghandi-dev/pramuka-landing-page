<script setup lang="ts">
import { KeyRound, Loader2, CheckCircle2, ArrowLeft } from "lucide-vue-next";

definePageMeta({
  layout: false,
  auth: false
})

const route = useRoute();
const token = route.query.token as string;

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const status = ref<'form' | 'success' | 'error'>('form');
const message = ref("");

const handleReset = async () => {
  console.log(token);

  if (password.value !== confirmPassword.value) {
    message.value = "Password tidak cocok.";
    status.value = 'error';
    return;
  }

  loading.value = true;
  status.value = 'form';
  message.value = "";

  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token,
        password: password.value
      }
    });
    status.value = 'success';
    message.value = "Password Anda berhasil diperbarui! Silakan masuk dengan password baru Anda.";
  } catch (err: any) {
    status.value = 'error';
    message.value = err.data?.statusMessage || "Gagal memperbarui password.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!token) {
    status.value = 'error';
    message.value = "Token reset tidak ditemukan.";
  }
});
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-card border border-border/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <div class="text-center mb-8">
          <div class="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <KeyRound class="w-8 h-8 text-primary" />
          </div>
          <h1 class="text-2xl font-display font-bold">Reset Password</h1>
          <p class="text-muted-foreground mt-2">Masukkan password baru Anda</p>
        </div>

        <div v-if="status === 'success'" class="text-center">
          <div class="flex justify-center mb-4">
            <CheckCircle2 class="w-12 h-12 text-green-500" />
          </div>
          <p class="text-foreground mb-8">{{ message }}</p>
          <NuxtLink to="/auth/login"
            class="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:opacity-90">
            Lanjut ke Login
          </NuxtLink>
        </div>

        <form v-else @submit.prevent="handleReset" class="space-y-4">
          <!-- Alert Message -->
          <div v-if="message" :class="[
            'p-3 rounded-lg text-sm border',
            status === 'error' ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-muted border-border text-muted-foreground'
          ]">
            {{ message }}
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Password Baru</label>
            <input v-model="password" type="password"
              class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="••••••••" required :disabled="loading || !token" />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Konfirmasi Password</label>
            <input v-model="confirmPassword" type="password"
              class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="••••••••" required :disabled="loading || !token" />
          </div>

          <button type="submit"
            class="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
            :disabled="loading || !token">
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            {{ loading ? 'Memproses...' : 'Perbarui Password' }}
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
