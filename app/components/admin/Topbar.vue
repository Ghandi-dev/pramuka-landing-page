<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

const emit = defineEmits<{
    (e: 'toggle-sidebar'): void
}>()
</script>

<template>
    <header
        class="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <!-- Mobile menu button -->
        <button @click="emit('toggle-sidebar')"
            class="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted text-foreground/70 hover:text-foreground transition-colors">
            <Menu class="w-5 h-5" />
        </button>

        <!-- Spacer for desktop -->
        <div class="hidden lg:block" />

        <!-- Right side -->
        <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
                <div
                    class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                    AD
                </div>
                <span class="text-sm font-medium text-foreground hidden sm:inline">Admin</span>
            </div>
        </div>
    </header>
</template>
