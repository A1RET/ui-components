import { ref } from "vue";
import type { Ref } from "vue";

export default function useSwipeClosing(element: Ref<HTMLElement | null>, close: () => void) {
    const startY = ref(0);
    const startTime = ref(0);
    const currentY = ref(0);
    const deltaY = ref(0);
    const threshold = 0.6;
    const velocityThreshold = 500;

    const handleTouchStart = (event: TouchEvent) => {
        const touch = event.touches[0];
        if (!touch) {
            return;
        }

        startY.value = touch.clientY;
        startTime.value = event.timeStamp;
    };

    const handleTouchMove = (event: TouchEvent) => {
        const touch = event.touches[0];
        if (!touch) {
            return;
        }

        currentY.value = touch.clientY;
        deltaY.value = currentY.value - startY.value;

        if (deltaY.value > 0) {
            element.value!.style.bottom = `-${deltaY.value}px`;
        }
    };

    const handleTouchEnd = (event: TouchEvent) => {
        const elementHeight = element.value?.getBoundingClientRect().height || 0;
        const movedPercentage = deltaY.value / elementHeight;

        const touch = event.changedTouches[0];
        if (!touch) {
            return;
        }

        const endY = touch.clientY;
        const deltaTime = event.timeStamp - startTime.value;
        const velocity = Math.abs((endY - startY.value) / deltaTime) * 1000;

        if (movedPercentage > threshold || velocity > velocityThreshold) {
            close();
        } else {
            element.value!.style.bottom = `0`;
        }

        startY.value = 0;
        startTime.value = 0;
        currentY.value = 0;
        deltaY.value = 0;
    };

    return {
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
}
