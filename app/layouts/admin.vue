<script setup lang="ts">
const sidebarOpen = ref(false)

definePageMeta({
    middleware: ['admin']
})
</script>

<template>
    <div class="flex min-h-screen bg-background">
        <AdminSidebar v-model:open="sidebarOpen" />

        <div class="flex-1 flex flex-col min-w-0">
            <AdminTopbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

            <main class="flex-1 p-4 lg:p-6 overflow-auto">
                <slot />
            </main>
        </div>
    </div>
</template>
