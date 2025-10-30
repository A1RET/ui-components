<template>
    <span :class="['range', className]">
        <TextInput
            v-model="fromValue"
            v-model:error="error"
            :clearing="false"
            is-number
            :placeholder="fromPlaceholder"
            :color="color"
            class-name="range-input"
            :class="['range__input range__input--from', { [`${className}__input`]: className }]"
            @input="(e) => onInput('from', e)"
            @change="(e) => onChange('from', e)"
        />
        <TextInput
            v-model="toValue"
            v-model:error="error"
            :clearing="false"
            is-number
            :placeholder="toPlaceholder"
            :color="color"
            class-name="range-input"
            :class="['range__input range__input--to', { [`${className}__input`]: className }]"
            @input="(e) => onInput('to', e)"
            @change="(e) => onChange('to', e)"
        />
    </span>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import TextInput from "@/components/TextInput.vue";

const {
    min = 0,
    max = null,
    fromPlaceholder = "from",
    toPlaceholder = "to",
    triggerChangeOnInput = false,
} = defineProps<{
    min?: number;
    max?: number;
    fromPlaceholder?: string;
    toPlaceholder?: string;
    className?: string;
    color?: "gray" | "transparent";
    triggerChangeOnInput?: boolean;
}>();

const fromValue = defineModel<string | number | null>("from");
const toValue = defineModel<string | number | null>("to");
const error = defineModel<boolean>("error");

const emits = defineEmits(["change"]);

const parsedFromValue = computed(() => {
    const value = fromValue.value;
    if (value === null || value === "") return null;
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
});

const parsedToValue = computed(() => {
    const value = toValue.value;
    if (value === null || value === "") return null;
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
});

function validateValue(field: "from" | "to") {
    const parsedValue = field === "from" ? parsedFromValue.value : parsedToValue.value;

    if (parsedValue === null) return;
    const modelValue = field === "from" ? fromValue : toValue;

    if (max !== null && parsedValue > max) {
        modelValue.value = max;
    }
    if (min !== null && parsedValue < min) {
        modelValue.value = min;
    }

    if (field === "to" && parsedFromValue.value !== null && parsedValue < parsedFromValue.value) {
        modelValue.value = parsedFromValue.value;
    }
    if (field === "from" && parsedToValue.value !== null && parsedValue > parsedToValue.value) {
        modelValue.value = parsedToValue.value;
    }
}

let timeout: number | null = null;

const initialValues = {
    from: fromValue.value,
    to: toValue.value,
};
const inited = ref(false);

function onInput(field: "from" | "to", value?: number) {
    if (!triggerChangeOnInput || (value === initialValues[field] && !inited.value)) {
        return;
    }

    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => {
        onChange(field);
    }, 1000);
}

function onChange(field: "from" | "to", event?: Event) {
    inited.value = true;
    let valueIsChanged = true;

    if (event) {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        valueIsChanged =
            value !== (field === "from" ? fromValue.value?.toString() : toValue.value?.toString());
    }

    if (!valueIsChanged) {
        return;
    }

    validateValue(field);

    emits("change");
}
</script>
