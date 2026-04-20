<script setup lang="ts">
import ConfirmDialog from '~/components/admin/ConfirmDialog.vue'

defineProps<{
    modelValue: boolean
    deleting: boolean
}>()

defineEmits(['update:modelValue', 'confirm'])
</script>

<template>
    <ConfirmDialog 
        :open="modelValue"
        @update:open="$emit('update:modelValue', $event)" 
        :loading="deleting" 
        @confirm="$emit('confirm')" 
    />
</template>
