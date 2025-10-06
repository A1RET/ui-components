<template>
    <svg class="svg-icon">
        <use :xlink:href="`/sprite#${id}`" />
    </svg>
</template>

<script setup lang="ts">
defineProps<{
    id: string;
}>();
</script>
