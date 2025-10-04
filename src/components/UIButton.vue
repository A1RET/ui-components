<template>
    <component
        :is="tag"
        :class="[
            'button',
            {
                [`button--${color}`]: color,
                [`button--size-${size}`]: size,
                [`button--bordered button--bordered-${color ? color : 'black'}`]: bordered,
                [`button--narrow${narrow !== true ? `-${narrow}` : ''}`]: narrow,
                'button--clear': clear,
                'button--transparent': transparent,
                'button--clear button--link': asLink,
                'button--no-label': hideLabel,
                'button--disabled': disabled,
            },
        ]"
        :aria-label="hideLabel ? label : ''"
        :disabled="disabled"
    >
        <span v-if="$slots.icon || isLoading" class="button__icon">
            <UILoader v-if="isLoading" class="button__loader" />
            <slot v-else name="icon" />
        </span>

        <span v-if="label && !hideLabel" class="button__label">
            {{ label }}
        </span>
        <slot v-else-if="!hideLabel" />

        <span v-if="$slots['icon-right']" class="button__icon">
            <slot name="icon-right" />
        </span>
    </component>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'

type Color = 'gray'

import UILoader from '@/components/UILoader.vue'

defineProps<{
    color?: Color
    clear?: boolean
    asLink?: boolean
    size?: 's' | 'l'
    label?: string
    hideLabel?: boolean
    narrow?: boolean | 's'
    bordered?: boolean
    transparent?: boolean
    disabled?: boolean
    isLoading?: boolean
}>()

const attrs = useAttrs()
const tag = attrs.href ? 'a' : 'button'
</script>
