import { ref, onMounted } from "vue";
import { useScrollLock } from "@vueuse/core";
import usePopupCount from "@/composables/usePopupCount";

const body = ref<HTMLBodyElement | null>(null);
const isLocked = useScrollLock(body);
const { counter: popupCount } = usePopupCount();

export function useBodyScrollLock() {
    onMounted(() => {
        body.value = document.body as HTMLBodyElement;
    });

    function lock() {
        isLocked.value = true;
    }

    function unlock() {
        if (popupCount.value === 0) {
            isLocked.value = false;
        }
    }

    return {
        lock,
        unlock,
    };
}
