<template>
    <span
        :class="[
            'tooltip',
            {
                show: isShow,
                [`tooltip--${positionVertical}`]: positionVertical,
                [`tooltip--${positionHorizontal}`]: positionHorizontal,
                [`${className}`]: className,
            },
        ]"
        @mouseenter="show"
        @mouseleave="hide"
    >
        <slot />
        <span :class="['tooltip__content', { [`${className}__content`]: className }]">
            <span v-if="positionVertical === 'top'" class="tooltip__arrow tooltip__arrow--bottom" />
            <span v-if="positionVertical === 'bottom'" class="tooltip__arrow tooltip__arrow--top" />
            <span ref="tooltipText" class="tooltip__text" :style="styles">
                <slot name="content" />
            </span>
        </span>
    </span>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from "vue";

const { positionVertical = "top", positionHorizontal } = defineProps<{
    positionVertical?: "top" | "bottom";
    positionHorizontal?: "left" | "right";
    className?: string;
}>();

const isShow = defineModel<boolean>();

const tooltipText = useTemplateRef<HTMLSpanElement>("tooltipText");
const styles = ref<Record<string, string>>({});
function calcPosition() {
    const rect = tooltipText.value?.getBoundingClientRect();
    if (rect) {
        if (positionHorizontal === "left") {
            styles.value["left"] = `-${rect.width / 2 - 10}px`;
        } else if (positionHorizontal === "right") {
            styles.value["right"] = "-10px";
        }
    }
}

onMounted(() => {
    calcPosition();
});

function show() {
    calcPosition();
    isShow.value = true;
}

function hide() {
    isShow.value = false;
}
</script>
