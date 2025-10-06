<template>
    <div
        :class="[
            'checkboxes-group checkboxes-group--radio',
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
            type="radio"
            :name="name"
            :value="option.value"
            :label="option.label"
            :model-value="
                modelValue !== null && typeof modelValue === 'object' && modelValue![valueAttribute]
                    ? modelValue![valueAttribute]
                    : modelValue
            "
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

type Model = string | number | { [key: string]: string } | null;

const {
    modelValue = null,
    options = [],
    optionAttribute = "label",
    valueAttribute = "value",
    isList,
    controlClassName = "",
} = defineProps<{
    modelValue?: Model;
    options?: Array<Model>;
    name?: string;
    optionAttribute?: string;
    valueAttribute?: string;
    isColumn?: boolean;
    reversed?: boolean;
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
function guessOptionSelected(option: any) {
    return modelValue === guessOptionValue(option);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeOption(option: any) {
    if (["string", "number", "boolean"].includes(typeof option)) {
        return {
            value: option,
            label: option,
            selected: modelValue === option,
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

function onUpdate(value: Model) {
    let newValue = value;

    options.forEach((option) => {
        if (guessOptionValue(option) === value) {
            newValue = option;
        }
    });

    emits("update:modelValue", newValue);
    emits("change", newValue);
}
</script>
