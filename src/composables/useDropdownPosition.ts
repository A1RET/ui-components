import type { Ref } from "vue";
import { ref } from "vue";
import { useEventListener } from "@vueuse/core";

export default function useDropdownPosition(
    block: Ref<HTMLElement | null>,
    dropdown: Ref<HTMLElement | null>,
) {
    const positionVertical = ref<"up" | "down">("down");
    const positionHorizontal = ref<"right" | "left">("left");

    function checkPosition() {
        if (!block.value || !dropdown.value) return;

        const selectRect = block.value.getBoundingClientRect();
        const optionsHeight = dropdown.value.getBoundingClientRect().height;
        const optionsWidth = dropdown.value.getBoundingClientRect().width;
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        const spaceBelow = windowHeight - selectRect.bottom;
        const spaceAbove = selectRect.top;
        positionVertical.value =
            spaceBelow >= optionsHeight || spaceBelow >= spaceAbove ? "down" : "up";

        const spaceRight = windowWidth - selectRect.right;
        const spaceLeft = selectRect.left;
        positionHorizontal.value =
            spaceRight >= optionsWidth || spaceRight >= spaceLeft ? "left" : "right";
    }

    useEventListener(window, "scroll", checkPosition);
    useEventListener(window, "resize", checkPosition);

    return {
        positionVertical,
        positionHorizontal,
        checkPosition,
    };
}
