import { ref } from "vue";

const counter = ref(0);

export default function usePopupCount() {
    function changeCount(toOpen: boolean = true) {
        counter.value += toOpen ? 1 : -1;
    }

    return {
        counter,
        changeCount,
    };
}
