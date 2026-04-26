<script setup lang="ts">
import { Menu, User } from 'lucide-vue-next'

const emit = defineEmits<{
    (e: 'toggle-sidebar'): void
}>()

const { profile } = useAdminAuth()
</script>

<template>
    <header
        class="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <!-- Mobile menu button -->
        <button @click="emit('toggle-sidebar')"
            class="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted text-foreground/70 hover:text-foreground transition-colors">
            <Menu class="w-5 h-5" />
        </button>

        <!-- Spacer for desktop -->
        <div class="hidden lg:block" />

        <!-- Right side -->
        <div class="flex items-center gap-3">
            <div v-if="profile" class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-full bg-muted overflow-hidden border border-border shadow-sm">
                    <img v-if="profile.avatar_url" :src="profile.avatar_url" class="w-full h-full object-cover" />
                    <User v-else class="w-full h-full p-2 text-muted-foreground" />
                </div>
                <div class="hidden sm:block">
                    <p class="text-sm font-semibold text-foreground leading-none">{{ profile.name }}</p>
                    <p class="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">{{ profile.role
                    }}</p>
                </div>
            </div>
        </div>
    </header>
</template>
