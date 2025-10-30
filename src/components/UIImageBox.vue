<template>
    <div
        :class="[
            attrs.class,
            'image-box',
            { [`image-box--${fit}`]: fit, loading: isLoading || hasError },
        ]"
    >
        <img
            v-if="imageSrcAttrs.src && !hasError"
            v-bind="{
                ...attrs,
                class: null,
                src: imageSrcAttrs.src,
                srcset: imageSrcAttrs.srcset,
            }"
            ref="imageRef"
            :class="['image-box__image', imageClass, { 'image-box__image--loading': isLoading }]"
            loading="lazy"
        />
        <span v-if="isLoading || hasError" class="image-box__preloader skeleton" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, useAttrs } from "vue";

type Image =
    | string
    | {
          src: string;
          src2x?: string;
      };

defineOptions({
    inheritAttrs: false,
});

const { image } = defineProps<{
    image?: Image;
    imageClass?: string;
    fit?: "cover" | "contain" | "fill" | "responsive";
}>();

const emit = defineEmits(["loaded", "error"]);

const attrs = useAttrs();

const imageSrcAttrs = computed(() => {
    let src = undefined;
    let srcset = undefined;

    if (typeof image === "string") {
        src = image;
    } else if (image) {
        src = image.src || undefined;
        srcset = image.src2x ? `${image.src2x} 2x` : undefined;
    }

    if (attrs.src) {
        src = attrs.src as string;
    }
    if (attrs.srcset) {
        srcset = attrs.srcset as string;
    }

    return {
        src,
        srcset,
    };
});

const isLoading = ref<boolean>(true);
const hasError = ref<boolean>(false);
const imageRef = ref<HTMLImageElement | null>(null);

let loadHandler: (() => void) | null = null;
let errorHandler: ((event: Event) => void) | null = null;

function onImageLoaded() {
    isLoading.value = false;
    hasError.value = false;
    emit("loaded");
}

function onImageError() {
    isLoading.value = false;
    hasError.value = true;
    emit("error");
}

onMounted(() => {
    if (imageRef.value) {
        if (imageRef.value.complete) {
            if (imageRef.value.naturalWidth === 0) {
                onImageError();
            } else {
                onImageLoaded();
            }
        } else {
            loadHandler = () => onImageLoaded();
            errorHandler = () => onImageError();

            imageRef.value.addEventListener("load", loadHandler);
            imageRef.value.addEventListener("error", errorHandler);
        }
    } else {
        isLoading.value = true;
    }
});

onBeforeUnmount(() => {
    if (imageRef.value && loadHandler && errorHandler) {
        imageRef.value.removeEventListener("load", loadHandler);
        imageRef.value.removeEventListener("error", errorHandler);
    }
});
</script>
