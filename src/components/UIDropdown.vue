<template>
    <div
        ref="dropdownRef"
        :class="[
            'dropdown',
            className,
            {
                opened: isOpen,
            },
        ]"
        @mouseleave="() => (isOnHover ? close() : null)"
    >
        <div
            class="dropdown__inner"
            @click="toggle"
            @mouseenter="() => (isOnHover ? open() : null)"
        >
            <slot />
        </div>

        <Transition name="slide-in-down" @enter="checkPosition">
            <div
                v-if="!isPopup"
                v-show="isOpen"
                :class="[
                    'dropdown__dropdown',
                    positionVertical,
                    horPositionProp ? horPositionProp : positionHorizontal,
                    { [`${className}__dropdown`]: className },
                ]"
            >
                <div
                    ref="contentRef"
                    :class="[
                        'dropdown__dropdown-content',
                        { [`${className}__dropdown-content`]: className },
                    ]"
                >
                    <div v-if="isContentHeader" class="dropdown__content-header">
                        <span class="dropdown__content-header-title">
                            <slot v-if="$slots.header" name="header" />
                            <template v-else>
                                {{ headerTitle }}
                            </template>
                        </span>
                        <button
                            :class="['dropdown__close button button--link']"
                            type="button"
                            @click="close"
                        >
                            <UISvgIcon id="ic_x" class="svg-icon" />
                        </button>
                    </div>
                    <slot name="content" />
                </div>
            </div>
        </Transition>
        <UIPopup
            v-if="isPopup && isOpen"
            ref="popupRef"
            v-model="isOpen"
            :title="popupTitle ? popupTitle : ''"
            class-name="dropdown-popup"
            bottom
            @closed="popupClosed"
        >
            <template v-if="$slots.header" #header>
                <slot name="header" />
            </template>
            <slot name="content" />
            <template v-if="defaultPopupFooter || $slots.footer" #footer>
                <slot v-if="$slots.popupFooter" name="popupFooter" />
                <UIButton v-else bordered class="dropdown-popup__close wide" @click="close">
                    Закрыть
                </UIButton>
            </template>
        </UIPopup>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef, onMounted } from "vue";
import { onClickOutside } from "@vueuse/core";

import checkDevice from "@/utils/checkDevice";

import UIButton from "@/components/UIButton.vue";
import UISvgIcon from "@/components/UISvgIcon.vue";
import UIPopup from "@/components/UIPopup.vue";
import useDropdownPosition from "@/composables/useDropdownPosition";

const { eventType = "click", defaultPopupFooter = true } = defineProps<{
    eventType?: "click" | "hover";
    isContentHeader?: boolean;
    headerTitle?: string;
    popupTitle?: string;
    defaultPopupFooter?: boolean;
    className?: string;
    horPositionProp?: "left" | "right";
}>();

const emit = defineEmits(["closed"]);

const { isMobileOrTablet } = checkDevice();
const isPopup = ref<boolean>(true);
const isOnHover = computed(() => eventType === "hover" && !isPopup.value);

const isOpen = ref<boolean>(false);
const dropdownRef = useTemplateRef<HTMLDivElement | null>("dropdownRef");
const popupRef = ref<InstanceType<typeof UIPopup> | null>(null);
const contentRef = useTemplateRef<HTMLDivElement | null>("contentRef");

function toggle(): void {
    isOpen.value = !isOpen.value;
}

function open(): void {
    isOpen.value = true;
}

function close(): void {
    if (isPopup.value && popupRef.value) {
        popupRef.value.close();
    } else {
        isOpen.value = false;
        emit("closed");
    }
}

function popupClosed(): void {
    isOpen.value = false;
    emit("closed");
}

const { positionVertical, positionHorizontal, checkPosition } = useDropdownPosition(
    dropdownRef,
    contentRef,
);

onMounted(() => {
    isPopup.value = isMobileOrTablet;

    if (!isPopup.value) {
        onClickOutside(dropdownRef, close);
    }
});

defineExpose({
    close,
});
</script>
