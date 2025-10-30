<template>
    <div
        ref="selectRef"
        :class="[
            'select',
            className,
            {
                [`select--${color}`]: color,
                'select--semibold': semibold,
            },
        ]"
        tabindex="0"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-haspopup="true"
        :aria-controls="'select-options-' + selectId"
        :aria-activedescendant="activeDescendant"
        @keydown="handleKeyDown"
    >
        <select
            class="visually-hidden"
            :multiple="multiple"
            :disabled="isDisabled"
            @change="
                (e: Event) =>
                    selectOption(
                        normalizedOptions.find(
                            (option) => option.value === (e.target as HTMLSelectElement).value,
                        )!,
                    )
            "
        >
            <option
                v-for="option in normalizedOptions"
                :key="option.value"
                :value="option.value"
                :selected="option.selected"
            >
                {{ option.label }}
            </option>
        </select>
        <div
            class="select__field"
            :class="{
                active: isOpen,
                'select__field--centered': isCentered,
                [`${className}__field`]: className,
            }"
            @click="toggleOptions"
        >
            <div class="select__selected-values">
                <template v-if="multiple">
                    <div v-if="hasSelected && showSelected" class="select__multi-values">
                        <span
                            v-for="item in selectedItems"
                            :key="item.value"
                            class="select__selected-tag"
                        >
                            {{ item.label }}
                            <UISvgIcon
                                id="ic_x"
                                class="select__remove-tag"
                                @click.stop="selectOption(item)"
                            />
                        </span>
                    </div>
                    <span
                        v-else
                        :class="[
                            'select__placeholder',
                            {
                                'select__placeholder--active': hasSelected,
                                [`${className}__placeholder`]: className,
                            },
                        ]"
                    >
                        {{ placeholder }}
                        <span v-if="hasSelected && showSelectedCount" class="select__count">{{
                            selectedItems.length
                        }}</span>
                    </span>
                </template>
                <template v-else>
                    <span v-if="hasSelected" class="select__selected-value">
                        {{
                            selectedItems[0]!.selectedLabel
                                ? selectedItems[0]!.selectedLabel
                                : selectedItems[0]!.label
                        }}
                    </span>
                    <span v-else class="select__placeholder">
                        {{ placeholder }}
                    </span>
                </template>
            </div>
            <UISvgIcon
                v-if="!isDisabled || disabled"
                id="ic_chevron-down"
                class="select__select-arrow"
            />
        </div>

        <Transition name="slide-in-down" @enter="checkPosition">
            <div
                v-if="!isPopup"
                v-show="isOpen"
                :id="'select-options-' + selectId"
                :class="[
                    'select__options',
                    positionVertical,
                    positionHorizontal,
                    {
                        [`${className}__options`]: className,
                    },
                ]"
                role="listbox"
                :aria-multiselectable="multiple"
            >
                <div ref="optionsRef" class="select__options-list options-list">
                    <label
                        v-for="(option, index) in normalizedOptions"
                        :id="'option-' + selectId + '-' + index"
                        :key="option.value"
                        class="options-list-item"
                        :class="{
                            active: option.selected,
                            focused: focusedIndex === index,
                        }"
                        role="option"
                        :aria-selected="option.selected"
                        @click="selectOption(option)"
                        @mouseover="focusedIndex = index"
                    >
                        <template v-if="multiple">
                            <input
                                type="checkbox"
                                :checked="option.selected"
                                class="options-list-item__mark visually-hidden"
                                @click.stop
                            />
                        </template>
                        {{ option.label }}
                    </label>
                </div>
            </div>
        </Transition>

        <UIPopup
            v-if="isPopup && isOpen"
            ref="popupRef"
            v-model="isOpen"
            :title="popupTitle ? popupTitle : placeholder"
            class-name="select-popup"
            bottom
            @closed="closePopup"
        >
            <div class="options-list">
                <div
                    v-for="option in popupOptions"
                    :key="option.value"
                    class="options-list-item"
                    :class="{ active: option.selected }"
                    @click="multiple ? selectOptionPopup(option) : selectOption(option)"
                >
                    <template v-if="multiple">
                        <input
                            type="checkbox"
                            :checked="option.selected"
                            class="options-list-item__mark visually-hidden"
                            @click.stop
                        />
                    </template>
                    {{ option.label }}
                </div>
            </div>
            <template #footer>
                <UIButton bordered class="select-popup__cancel-btn wide" @click="closePopup">
                    Закрыть
                </UIButton>
                <UIButton
                    v-if="applyByButton"
                    class="select-popup__apply-btn wide"
                    @click="applySelection"
                >
                    Применить
                </UIButton>
            </template>
        </UIPopup>
    </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, computed, watch, onMounted } from "vue";
import { onClickOutside } from "@vueuse/core";

import useDropdownPosition from "@/composables/useDropdownPosition";
import useUniqueId from "@/composables/useUniqueId";

import { get } from "@/utils/misc";
import checkDevice from "@/utils/checkDevice";

import UIButton from "@/components/UIButton.vue";
import UIPopup from "@/components/UIPopup.vue";
import UISvgIcon from "@/components/UISvgIcon.vue";

interface SelectOption {
    label: string;
    value: string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

type Model = string | number | object;

interface SelectProps {
    modelValue: Array<Model>;
    options: Array<Model>;
    optionAttribute?: string;
    valueAttribute?: string;
    multiple?: boolean;
    noEmptyAllowed?: boolean;
    showSelected?: boolean;
    showSelectedCount?: boolean;
    placeholder?: string;
    popupTitle?: string;
    applyByButton?: boolean;
    className?: string;
    color?: "transparent";
    semibold?: boolean;
    isCentered?: boolean;
    disabled?: boolean;
}

const {
    options,
    modelValue = [],
    optionAttribute = "label",
    valueAttribute = "value",
    multiple = false,
    noEmptyAllowed = false,
    showSelectedCount = true,
    placeholder = "Выберите значение",
    popupTitle = "Выберите значения",
    applyByButton = false,
    disabled = false,
} = defineProps<SelectProps>();

const { isMobileOrTablet } = checkDevice();
const isPopup = ref<boolean>(true);
const selectId = useUniqueId("select");

const emits = defineEmits(["update:modelValue", "change"]);
const popupOptions = ref<Array<SelectOption>>([]);
const tempSelection = ref<Array<Model>>([...modelValue]);

const selectedItems = computed<Array<SelectOption>>(() => {
    return normalizedOptions.value.filter((option) => option.selected);
});

const hasSelected = computed<boolean>(() => selectedItems.value.length > 0);

const normalizedOptions = computed<Array<SelectOption>>(() => {
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

function getOptionByValue(options: Array<Model>, value: string | number | object) {
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
function normalizeOption(option: any): SelectOption {
    if (["string", "number"].includes(typeof option)) {
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

const isDisabled = computed(() => disabled || (options.length <= 1 && noEmptyAllowed));

function selectOption(option: SelectOption, isTemp = false): void {
    if (isDisabled.value) {
        return;
    }

    const targetArray = isTemp ? tempSelection.value : modelValue;
    const optionValue = getOptionByValue(options, option.value);
    if (!optionValue) return;

    const optionModelValue = getOptionByValue(targetArray, option.value);

    let newValue: Array<Model>;

    if (optionModelValue && !multiple && noEmptyAllowed) {
        return;
    }

    if (optionModelValue) {
        newValue = targetArray.filter(
            (item: Model) => JSON.stringify(item) !== JSON.stringify(optionModelValue),
        );
    } else {
        if (multiple) {
            newValue = [...targetArray, optionValue];
        } else {
            newValue = [optionValue];
        }
    }

    if (isTemp) {
        tempSelection.value = newValue;
    } else {
        emits("update:modelValue", newValue);
        emits("change", newValue);
        if (!multiple) {
            if (isPopup.value) {
                closePopup();
            } else {
                closeSelect();
            }
        }
    }
}

function selectOptionPopup(option: SelectOption): void {
    option.selected = !option.selected;
    selectOption(option, applyByButton);
}

function applySelection(): void {
    emits("update:modelValue", tempSelection.value);
    emits("change", tempSelection.value);
    closePopup();
}

const isOpen = ref<boolean>(false);
const selectRef = useTemplateRef<HTMLDivElement | null>("selectRef");
const optionsRef = useTemplateRef<HTMLDivElement | null>("optionsRef");
const focusedIndex = ref<number>(-1);
const activeDescendant = computed(() =>
    focusedIndex.value >= 0 ? `option-${selectId.value}-${focusedIndex.value}` : "",
);

function handleKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
        case "Enter":
        case " ":
            e.preventDefault();
            if (!isOpen.value) {
                toggleOptions();
            } else if (focusedIndex.value >= 0) {
                const option = normalizedOptions.value[focusedIndex.value];
                if (!option) {
                    return;
                }

                selectOption(option);
            }
            break;
        case "ArrowDown":
            e.preventDefault();
            if (!isOpen.value) {
                toggleOptions();
            }
            focusedIndex.value = Math.min(
                focusedIndex.value + 1,
                normalizedOptions.value.length - 1,
            );
            if (focusedIndex.value === -1) focusedIndex.value = 0;
            scrollToFocused();
            break;
        case "ArrowUp":
            e.preventDefault();
            if (!isOpen.value) {
                toggleOptions();
            }
            focusedIndex.value = Math.max(focusedIndex.value - 1, 0);
            scrollToFocused();
            break;
        case "Escape":
            e.preventDefault();
            closeSelect();
            break;
        case "Tab":
            if (isOpen.value) {
                closeSelect();
            }
            break;
    }
}
function scrollToFocused(): void {
    if (!optionsRef.value) return;

    const focusedElement = optionsRef.value.children[focusedIndex.value] as HTMLElement;
    if (focusedElement) {
        focusedElement.scrollIntoView({ block: "nearest" });
    }
}

function toggleOptions(): void {
    if (isDisabled.value) {
        isOpen.value = false;
        return;
    }

    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        if (isPopup.value) {
            popupOptions.value = [...normalizedOptions.value];
        } else {
            focusedIndex.value = normalizedOptions.value.findIndex((opt) => opt.selected) ?? 0;
        }
    }
}

function closeSelect(): void {
    isOpen.value = false;
    focusedIndex.value = -1;
}

const popupRef = useTemplateRef<InstanceType<typeof UIPopup> | null>("popupRef");

function closePopup(): void {
    popupRef.value?.close();
    tempSelection.value = [];
}

watch(isOpen, (newValue) => {
    if (!newValue) {
        focusedIndex.value = -1;
    }
});

const { positionVertical, positionHorizontal, checkPosition } = useDropdownPosition(
    selectRef,
    optionsRef,
);

watch(() => options, checkPosition);

onMounted(() => {
    isPopup.value = isMobileOrTablet;

    if (!isPopup.value) {
        onClickOutside(selectRef, closeSelect);
    }
});
</script>
