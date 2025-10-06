<template>
    <label
        :class="[
            'checkbox',
            className['el'],
            {
                active: isActive,
                disabled: disabled,
                'checkbox--radio': isRadio,
                'checkbox--reversed': reversed,
                'checkbox--chip': isChip,
                [`checkbox--size-${size}`]: size,
                'checkbox--list': isList,
                'checkbox--required': required,
                'checkbox--error': error,
            },
        ]"
    >
        <input
            ref="input"
            v-model="model"
            class="checkbox__input"
            :type="type"
            :disabled="disabled"
            :name="name"
            :required="required"
            :value="value"
            v-bind="$attrs"
            @change="onChange"
        />
        <span
            v-if="!isChip"
            :class="[
                'checkbox__mark',
                className['mark'],
                {
                    'checkbox__mark--radio': isRadio && !isList,
                    'checkbox__mark--list': isList,
                },
            ]"
        >
            <UISvgIcon v-if="!isRadio && !isList" id="ic_check" class="checkbox__mark-icon" />
        </span>
        <span
            :class="[
                'checkbox__label',
                className['label'],
                {
                    'checkbox__label-chip': isChip,
                    'checkbox__label--required': required,
                },
            ]"
        >
            <slot v-if="$slots.label" name="label" />
            <span v-else v-html="label" />

            <span v-if="required" class="checkbox__required required">*</span>
        </span>
    </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

import UISvgIcon from "@/components/UISvgIcon.vue";

interface Props {
    modelValue?:
        | string
        | number
        | boolean
        | object
        | Array<string | number | boolean | object>
        | null;
    label?: string;
    type?: "checkbox" | "radio";
    name?: string;
    value?: string | number | boolean;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    classNames?: string | Array<string>;
    reversed?: boolean;
    isChip?: boolean;
    size?: "s" | "l";
    isList?: boolean;
}

type ElementsClasses = {
    el: string;
    label: string;
    mark: string;
};

const {
    modelValue = null,
    type = "checkbox",
    reversed = false,
    value,
    isChip = false,
    required = false,
    classNames = "",
} = defineProps<Props>();

const isRadio = type === "radio";

const emits = defineEmits(["update:modelValue", "change"]);
const model = computed({
    get() {
        return modelValue;
    },
    set(value) {
        emits("update:modelValue", value);
    },
});

const isActive = computed(() =>
    type === "radio" || typeof value === "boolean" ? model.value === value : model.value,
);

const className = computed(() => {
    const classes: ElementsClasses = {
        el: "",
        label: "",
        mark: "",
    };
    const classNamesArray: string[] = [];

    if (Array.isArray(classNames)) {
        classNamesArray.push(...classNames);
    } else if (classNames) {
        classNamesArray.push(classNames);
    }

    Object.keys(classes).forEach((key) => {
        let elementClass: string = "";

        classNamesArray.forEach((classItem: string) => {
            elementClass = `${elementClass} ${classItem}${key === "el" ? "" : `__${key}`}`;
        });

        classes[key as keyof ElementsClasses] = elementClass.trim();
    });

    return classes;
});

function onChange(e: Event) {
    const valueAttr = type === "checkbox" ? "checked" : "value";

    emits("change", (e.target as HTMLInputElement)[valueAttr]);
}
</script>
