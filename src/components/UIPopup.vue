<template>
    <Teleport to="#teleports">
        <div
            v-if="modelValue"
            :class="[
                'popup',
                attrs.class,
                className,
                {
                    'popup--full-screen': fullScreen,
                    [`${className}--full-screen`]: className && fullScreen,
                    'popup--bottom': bottom,
                },
            ]"
        >
            <Transition :name="fullScreen ? '' : 'fade'" @after-enter="onOpen" @click="close">
                <div
                    v-show="isOpen"
                    :class="[
                        'popup__overlay overlay',
                        {
                            [`${className}__overlay`]: className,
                        },
                    ]"
                />
            </Transition>
            <Transition
                :name="fullScreen ? 'fade' : 'scale-in'"
                @enter="calcContentHeight"
                @after-leave="onClose"
            >
                <div
                    v-show="appear"
                    ref="popupInner"
                    :class="[
                        'popup__inner',
                        {
                            [`${className}__inner`]: className,
                        },
                    ]"
                >
                    <div
                        ref="popupHeader"
                        :class="[
                            'popup__header',
                            {
                                'popup__header--center': $slots.header,
                                [`${className}__header`]: className,
                            },
                        ]"
                        @touchstart="handleTouchStart"
                        @touchmove="handleTouchMove"
                        @touchend="handleTouchEnd"
                    >
                        <slot name="header" />
                        <span
                            v-if="title"
                            :class="['popup__title', { [`${className}__title`]: className }]"
                        >
                            {{ title }}
                        </span>
                        <button
                            :class="[
                                'popup__close button button--link',
                                { [`${className}__close`]: className },
                            ]"
                            type="button"
                            @click="close"
                        >
                            <UISvgIcon id="ic_x" class="svg-icon" />
                        </button>
                    </div>
                    <div
                        ref="popupContent"
                        :class="[
                            'popup__content',
                            {
                                [`${className}__content`]: className,
                            },
                        ]"
                        :style="{
                            'max-height': maxContentHeightValue,
                        }"
                        tabindex="-1"
                    >
                        <slot />
                    </div>
                    <div
                        v-if="$slots.footer"
                        ref="popupFooter"
                        :class="[
                            'popup__footer',
                            {
                                [`${className}__footer`]: className,
                            },
                        ]"
                    >
                        <slot name="footer" />
                    </div>
                </div>
            </Transition>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, useAttrs, useTemplateRef } from "vue";
import { useEventListener } from "@vueuse/core";
import { useBodyScrollLock } from "@/composables/useBodyScrollLock";
import useSwipeClosing from "@/composables/useSwipeClosing";
import usePopupCount from "@/composables/usePopupCount";

import UISvgIcon from "@/components/UISvgIcon.vue";

defineProps<{
    title?: string;
    fullScreen?: boolean;
    bottom?: boolean;
    className?: string;
}>();

const emit = defineEmits(["update:modelValue", "opened", "closed"]);
const attrs = useAttrs();

const modelValue = defineModel<boolean>();
const isOpen = ref<boolean>();
const bodyScrollLock = useBodyScrollLock();

const appear = ref(false);
const popupContent = useTemplateRef<HTMLDivElement>("popupContent");
const hasActiveElement = ref(false);

function isInputElement(element: Element | null): boolean {
    if (!element) return false;

    const inputTypes = ["input", "textarea", "select", '[contenteditable="true"]'];

    return inputTypes.some(
        (selector) => element.matches(selector) || element.closest(selector) !== null,
    );
}

function handleEscapeKey(event: KeyboardEvent) {
    if (event.key !== "Escape" || !appear.value) return;

    const activeElement = document.activeElement;

    if (isInputElement(activeElement as Element)) {
        if (!hasActiveElement.value) {
            hasActiveElement.value = true;
            (activeElement as HTMLElement).blur();
            popupContent.value?.focus();
        } else {
            hasActiveElement.value = false;
            close();
        }
    } else {
        close();
    }
}

const { changeCount } = usePopupCount();

function onOpen() {
    appear.value = true;
    bodyScrollLock.lock();
    changeCount();
    nextTick(() => {
        popupContent.value?.focus();
    });
    emit("opened");
}
function close() {
    appear.value = false;
    hasActiveElement.value = false;
}

function onClose() {
    changeCount(false);
    bodyScrollLock.unlock();
    isOpen.value = false;
    emit("update:modelValue", false);
    emit("closed");
}

const popupInner = useTemplateRef<HTMLDivElement>("popupInner");
const popupHeader = useTemplateRef<HTMLDivElement>("popupHeader");
const popupFooter = useTemplateRef<HTMLDivElement>("popupFooter");
const maxContentHeightValue = ref<string>("100%");

function calcContentHeight() {
    const headerHeight = popupHeader.value?.getBoundingClientRect().height || 0;
    const footerHeight = popupFooter.value?.getBoundingClientRect().height || 0;

    const headerFooterHeight = headerHeight + footerHeight;

    maxContentHeightValue.value = `calc(100% - ${headerFooterHeight}px)`;
}

const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeClosing(popupInner, close);

onMounted(() => {
    isOpen.value = true;
    document.addEventListener("keydown", handleEscapeKey);
});

onUnmounted(() => {
    document.removeEventListener("keydown", handleEscapeKey);
});

useEventListener(window, "resize", calcContentHeight);

defineExpose({
    close,
});
</script>
