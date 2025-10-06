export function get(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    object: Record<string, any>,
    path: (string | number)[] | string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValue?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
    if (typeof path === "string") {
        path = path.split(".").map((key) => {
            const numKey = Number(key);
            return Number.isNaN(numKey) ? key : numKey;
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = object;

    for (const key of path) {
        if (result === undefined || result === null) {
            return defaultValue;
        }

        result = result[key];
    }

    return result !== undefined ? result : defaultValue;
}
