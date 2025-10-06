import { ref } from "vue";

let idCounter = 0;

export default function useUniqueId(prefix: string = "id") {
    return ref(`${prefix}-${++idCounter}`);
}
