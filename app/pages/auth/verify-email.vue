<script setup lang="ts">
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-vue-next";

definePageMeta({
  layout: false,
  auth: false
})

const route = useRoute();
const token = route.query.token as string;
const status = ref<'loading' | 'success' | 'error'>('loading');
const message = ref('Sedang memverifikasi email Anda...');
const resending = ref(false);

onMounted(async () => {
  if (!token) {
    status.value = 'error';
    message.value = 'Token verifikasi tidak ditemukan.';
    return;
  }

  try {
    const response = await $fetch('/api/auth/verify-email', {
      params: { token }
    });
    status.value = 'success';
    message.value = 'Email Anda berhasil diverifikasi! Anda sekarang dapat masuk ke akun Anda.';
  } catch (err: any) {
    status.value = 'error';
    message.value = err.data?.statusMessage || 'Verifikasi gagal atau token kedaluwarsa.';
  }
});

const handleResend = async () => {
  resending.value = true;
  try {
    const response = await $fetch('/api/auth/resend-verification', {
      method: 'POST',
      body: { token }
    }) as any;
    
    import('vue-sonner').then(({ toast }) => {
      toast.success(response.message || 'Email verifikasi telah dikirim ulang');
    });
    message.value = 'Email verifikasi baru telah dikirim. Silakan cek kotak masuk Anda.';
  } catch (err: any) {
    import('vue-sonner').then(({ toast }) => {
      toast.error(err.data?.statusMessage || 'Gagal mengirim ulang verifikasi');
    });
  } finally {
    resending.value = false;
  }
};
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center p-4">
    <div class="w-full max-w-md text-center">
      <div class="bg-card border border-border/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <!-- Icon State -->
        <div class="flex justify-center mb-6">
          <div v-if="status === 'loading'" class="p-4 rounded-full bg-primary/10">
            <Loader2 class="w-12 h-12 text-primary animate-spin" />
          </div>
          <div v-else-if="status === 'success'" class="p-4 rounded-full bg-green-500/10">
            <CheckCircle2 class="w-12 h-12 text-green-500" />
          </div>
          <div v-else class="p-4 rounded-full bg-destructive/10">
            <XCircle class="w-12 h-12 text-destructive" />
          </div>
        </div>

        <!-- Content -->
        <h1 class="text-2xl font-display font-bold mb-3">
          {{ status === 'loading' ? 'Memverifikasi...' : status === 'success' ? 'Berhasil!' : 'Gagal' }}
        </h1>
        <p class="text-muted-foreground mb-8">
          {{ message }}
        </p>

        <!-- Action -->
        <div v-if="status !== 'loading'" class="space-y-3">
          <Button v-if="status === 'error'" @click="handleResend" :disabled="resending" variant="outline" class="w-full h-12 rounded-xl">
            <Loader2 v-if="resending" class="w-4 h-4 mr-2 animate-spin" />
            {{ resending ? 'Mengirim ulang...' : 'Kirim Ulang Email Verifikasi' }}
          </Button>

          <NuxtLink to="/auth/login"
            class="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:opacity-90 active:scale-95">
            {{ status === 'success' ? 'Lanjut ke Login' : 'Kembali ke Login' }}
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
