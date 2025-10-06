<template>
    <div
        :class="[
            'checkboxes-group',
            {
                'checkboxes-group--column': isColumn,
                'options-list': isList,
            },
        ]"
    >
        <UICheckbox
            v-for="option in normalizedOptions"
            :key="option.value"
            :class-names="className"
            :name="name"
            :value="option.value"
            :label="option.label"
            :model-value="option.selected"
            :reversed="reversed"
            :size="size"
            :is-chip="isChip"
            :is-list="isList"
            :required="option.required"
            :disabled="option.disabled"
            :error="error"
            @change="onUpdate(option.value)"
        >
            <template v-if="$slots.label" #label>
                <slot name="label" v-bind="{ option, selected: option.selected }" />
            </template>
        </UICheckbox>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UICheckbox from "@/components/UICheckbox.vue";
import { get } from "@/utils/misc";

type Model = string | number | object;

const {
    modelValue = [],
    options = [],
    isOnlyValue = false,
    optionAttribute = "label",
    valueAttribute = "value",
    isList,
    controlClassName = "",
} = defineProps<{
    modelValue?: Array<Model>;
    options?: Array<Model>;
    isOnlyValue?: boolean;
    name?: string;
    optionAttribute?: string;
    valueAttribute?: string;
    reversed?: boolean;
    isColumn?: boolean;
    isChip?: boolean;
    size?: "s" | "l";
    isList?: boolean;
    controlClassName?: string | Array<string>;
    error?: boolean;
}>();

const className = computed(() => {
    const result: Array<string> = [];

    if (Array.isArray(controlClassName)) {
        result.push(...controlClassName);
    } else if (controlClassName) {
        result.push(controlClassName);
    }

    if (isList) {
        result.push("options-list-item");
    }

    return result;
});

const normalizedOptions = computed(() => {
    return options.map((option) => normalizeOption(option));
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function guessOptionValue(option: any) {
    return get(option, valueAttribute, get(option, optionAttribute));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function guessOptionText(option: any) {
    return get(option, optionAttribute, get(option, valueAttribute));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOptionByValue(options: Array<Model>, value: any) {
    return options.find((item: string | number | object) => {
        if (typeof item === "string" || typeof item === "number") {
            return item === value;
        } else {
            return guessOptionValue(item) === value;
        }
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function guessOptionSelected(option: any) {
    const optionValue = guessOptionValue(option);

    return getOptionByValue(modelValue, optionValue) !== undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeOption(option: any) {
    if (["string", "number", "boolean"].includes(typeof option)) {
        return {
            value: option,
            label: option,
            selected: modelValue.includes(option),
        };
    }

    return {
        ...option,
        value: guessOptionValue(option),
        label: guessOptionText(option),
        selected: guessOptionSelected(option),
    };
}

const emits = defineEmits(["update:modelValue", "change"]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onUpdate(value: any) {
    const optionValue = getOptionByValue(options, value);
    const optionModelValue = getOptionByValue(modelValue, value);

    let newValue;

    if (optionModelValue) {
        newValue = modelValue.filter(
            (item: Model) => JSON.stringify(item) !== JSON.stringify(optionModelValue),
        );
    } else if (isOnlyValue) {
        newValue = [optionValue];
    } else {
        newValue = [...modelValue, optionValue];
    }

    emits("update:modelValue", newValue);
    emits("change", newValue);
}
</script>
