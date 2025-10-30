<template>
    <label
        :class="[
            attrs.class,
            'text-input',
            className,
            {
                'text-input--wide': wide,
            },
        ]"
    >
        <span
            :class="[
                'text-input__field',
                {
                    [`text-input__field--${color}`]: color,
                    [`text-input__field--size-${size}`]: size,
                    'text-input__field--padding': padding,
                    'text-input__field--clearing': clearing,
                    'text-input__field--search': isSearch,
                    [`${className}__field`]: className,
                    focussed: focussed,
                    active: model,
                    error: error,
                },
            ]"
        >
            <UISvgIcon
                v-if="icon || isSearch"
                :id="icon ? icon : 'ic_search'"
                :class="[
                    'text-input__icon',
                    {
                        [`${className}__icon`]: className,
                    },
                ]"
            />
            <input
                v-if="!isTextarea"
                v-bind="{ ...attrs, class: null }"
                ref="input"
                v-maska:unmaskedValue.unmasked="maskOptions"
                :value="value"
                :class="[
                    'text-input__input',
                    {
                        [`${className}__input`]: className,
                    },
                ]"
                :type="type"
                :inputmode="isNumber || isTel ? 'decimal' : 'text'"
                @maska="onMaska"
                @change="onChange"
                @focus="onFocus"
                @blur="onBlurred"
            />
            <textarea
                v-else
                v-bind="{ ...attrs, class: null }"
                ref="textarea"
                v-model="textAreaValue"
                :class="[
                    'text-input__input text-input__textarea',
                    {
                        [`${className}__textarea`]: className,
                    },
                ]"
                @input="onTextareaInput"
                @change="onChange"
                @focus="onFocus"
                @blur="onBlurred"
            />
            <button
                v-if="clearing"
                :class="[
                    'text-input__clear',
                    {
                        [`${className}__clear`]: className,
                    },
                ]"
                type="button"
                @click.stop="clear"
            >
                <UISvgIcon id="ic_x" />
            </button>
        </span>
        <span
            v-if="(error && errorMessage) || hint || $slots.hint"
            :class="['text-input__hint', { [`${className}__hint`]: className }]"
        >
            <template v-if="error && errorMessage">
                {{ errorMessage }}
            </template>
            <slot v-else-if="$slots.hint" name="hint" />
            <template v-else>
                {{ hint }}
            </template>
        </span>
    </label>
</template>

<script setup lang="ts">
import type { MaskaDetail, MaskInputOptions } from "maska";

import { ref, computed, onMounted, useAttrs } from "vue";
import { useTextareaAutosize } from "@vueuse/core";
import { vMaska } from "maska/vue";

import UISvgIcon from "./UISvgIcon.vue";

defineOptions({
    inheritAttrs: false,
});

interface Props {
    className?: string;
    inputValue?: string | number | null;
    type?: "text" | "email" | "password" | "tel" | "number";
    color?: "gray" | "transparent";
    size?: "s" | "l";
    padding?: boolean;
    wide?: boolean;
    clearing?: boolean;
    isSearch?: boolean;
    hint?: string;
    errorMessage?: string;
    icon?: string;
    isNumber?: boolean;
    isTextarea?: boolean;
    isAutofocus?: boolean;
    mask?: string;
}
const attrs = useAttrs();

const {
    inputValue,
    type = "text",
    clearing = true,
    isNumber = false,
    isTextarea = false,
    isAutofocus = false,
    mask,
} = defineProps<Props>();
const model = defineModel<string | number | null>();
const unmaskedValue = ref("");
const error = defineModel<boolean>("error");
const focussed = ref(false);

const value = computed(() => {
    if (typeof inputValue !== "undefined") {
        return inputValue;
    }

    return model.value;
});

const emits = defineEmits(["update:error", "input", "change", "clear"]);

const { textarea, input: textAreaValue } = useTextareaAutosize();

const isTel = computed(() => type === "tel");

function onTextareaInput() {
    emits("update:error", false);
    model.value = textAreaValue.value;
    emits("input", textAreaValue.value);
}

function onMaska(event: CustomEvent<MaskaDetail>) {
    emits("update:error", false);
    const { unmasked } = event.detail;

    let value: string | number | null = isNumber ? parseFloat(unmasked) : unmasked;

    if (isNumber && isNaN(value as number)) {
        value = 0;
    }

    model.value = value;
    setTimeout(() => {
        emits("input", value);
    });
}

const maskOptions = computed<MaskInputOptions>(() => {
    let options: MaskInputOptions = {
        mask: null,
    };

    if (isNumber) {
        options = {
            number: {
                locale: "fr",
            },
        };
    }

    if (isTel.value) {
        options = {
            mask: "+# ### ###-##-##",
        };
    }

    if (mask) {
        options = {
            mask,
        };
    }

    return options;
});

function onChange(e: Event) {
    emits("change", e);
}

function onFocus() {
    focussed.value = true;
}

function onBlurred() {
    if (isNumber && isNaN(parseFloat(unmaskedValue.value))) {
        model.value = null;
    }

    focussed.value = false;
}

const input = ref<HTMLInputElement>();

function clear() {
    model.value = "";
    emits("clear");
    emits("update:error", false);
}

function focus() {
    if (input.value) {
        input.value.focus();
    } else if (textarea.value) {
        textarea.value.focus();
    }
}

function blur() {
    if (input.value) {
        input.value.blur();
    } else if (textarea.value) {
        textarea.value.blur();
    }
}

onMounted(() => {
    if (isAutofocus) {
        setTimeout(() => {
            focus();
        }, 400);
    }
});

defineExpose({
    focus,
    blur,
    unmaskedValue,
});
</script>
