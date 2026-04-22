<script setup lang="ts">
import { LogIn, Loader2 } from 'lucide-vue-next'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

definePageMeta({
    layout: false
})

useHead({ title: 'Login Admin', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const router = useRouter()
const nuxtApp = useNuxtApp()
const supabase = nuxtApp.$supabase as SupabaseClient

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
    loading.value = true
    errorMsg.value = ''
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })
        if (error) throw error
        router.push('/admin')
    } catch (e: any) {
        errorMsg.value = e.message || 'Login gagal. Periksa kredensial Anda.'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-muted/40 p-4">
        <div class="w-full max-w-md">
            <Card class="border-border/50 shadow-xl">
                <CardHeader class="text-center pb-2">
                    <div class="flex items-center justify-center gap-3 mb-4">
                        <img src="/images/logo_pa.webp" alt="Logo Ambalan Putra" class="h-14 w-14 object-contain" />
                        <img src="/images/logo_pi.webp" alt="Logo Ambalan Putri" class="h-14 w-14 object-contain" />
                    </div>
                    <CardTitle class="text-2xl font-display font-bold">Login Admin</CardTitle>
                    <CardDescription>Masukkan kredensial untuk mengakses dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="handleLogin" class="space-y-4">
                        <!-- Error message -->
                        <div v-if="errorMsg"
                            class="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                            {{ errorMsg }}
                        </div>

                        <div class="space-y-2">
                            <Label for="email">Email</Label>
                            <Input id="email" v-model="email" type="email" placeholder="admin@pramuka.com"
                                required autocomplete="email" />
                        </div>
                        <div class="space-y-2">
                            <Label for="password">Password</Label>
                            <Input id="password" v-model="password" type="password" required
                                autocomplete="current-password" />
                        </div>
                        <Button type="submit" class="w-full" :disabled="loading">
                            <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                            <LogIn v-else class="w-4 h-4 mr-2" />
                            {{ loading ? 'Memproses...' : 'Login' }}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
