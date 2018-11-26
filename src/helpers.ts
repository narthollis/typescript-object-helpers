export function keyInObject<T>(x: T, k: string | number | Symbol): k is keyof T {
    return k in x;
}
