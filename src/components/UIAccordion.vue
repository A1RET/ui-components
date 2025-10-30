<template>
    <div
        :class="[
            'accordion',
            {
                [`${className}`]: className,
            },
        ]"
    >
        <div
            v-for="(item, index) in items"
            :key="index"
            :class="[
                'accordion__item',
                {
                    [`${className}__item`]: className,
                    active: isActive(index),
                },
            ]"
        >
            <div
                :class="[
                    'accordion__header',
                    {
                        [`${className}__header`]: className,
                    },
                ]"
                @click="toggle(index)"
            >
                <span
                    :class="[
                        'accordion__title',
                        {
                            [`${className}__title`]: className,
                        },
                    ]"
                >
                    {{ item[titleKey] }}
                </span>
                <UISvgIcon
                    id="ic_chevron-down"
                    :class="['accordion__arrow', `${className}__arrow`]"
                />
            </div>
            <div ref="content" :class="['accordion__content', `${className}__content`]">
                <div
                    ref="content-inner"
                    :class="['accordion__content-inner', `${className}__content-inner`]"
                >
                    <slot v-if="$slots.content" name="content" :content="item[contentKey]" />
                    <div v-else v-html="item[contentKey]" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";

import UISvgIcon from "./UISvgIcon.vue";

const {
    items,
    isMultiple,
    isOpen,
    activeIndexes,
    titleKey = "title",
    contentKey = "content",
} = defineProps<{
    items: Array<{ [key: string]: string | number | Array<string | object> }>;
    className?: string;
    isMultiple?: boolean;
    isOpen?: boolean;
    activeIndexes?: Array<number>;
    titleKey?: string;
    contentKey?: string;
}>();

const active = ref<Array<number>>([...(activeIndexes || [])]);
const contentRefs = useTemplateRef<Array<HTMLDivElement>>("content");
const innerRefs = useTemplateRef<Array<HTMLDivElement>>("content-inner");

if (isOpen) {
    active.value = items.map((item, index) => index);
}

function toggle(index: number) {
    if (isActive(index)) {
        active.value = active.value.filter((i) => i !== index);
    } else {
        if (!isMultiple) {
            active.value = [index];
        } else {
            active.value.push(index);
        }
    }

    changeState();
}

function calculateContentHeight(index: number) {
    const contentEl = innerRefs.value![index];
    if (contentEl) {
        console.log(contentEl);
        console.log(contentEl.scrollHeight);
        return contentEl.scrollHeight;
    } else {
        return 0;
    }
}

function changeState() {
    contentRefs.value?.forEach((item, i) => {
        if (isActive(i)) {
            item.style.height = `${calculateContentHeight(i)}px`;
        } else {
            item.style.height = "0";
        }
    });
}

function isActive(index: number) {
    return active.value.includes(index);
}
</script>
