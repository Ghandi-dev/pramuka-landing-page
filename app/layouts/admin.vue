<script setup lang="ts">
const sidebarOpen = ref(false)

definePageMeta({
    middleware: ['admin']
})
</script>

<template>
    <div class="flex h-screen overflow-hidden bg-background">
        <AdminSidebar v-model:open="sidebarOpen" />

        <div class="flex-1 flex flex-col min-w-0">
            <AdminTopbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

            <main class="flex-1 px-4 pb-4 lg:px-6 lg:pb-4 overflow-auto">
                <slot />
            </main>
        </div>
    </div>
</template>
