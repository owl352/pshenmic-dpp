export function mapGroveElement(element) {
    return {
        type: element.type,
        wrapper: element.wrapper != null ? element.wrapper : undefined,
        value: element.value ?? undefined,
        sum: element.sum != null ? BigInt(element.sum) : undefined,
        count: element.count != null ? BigInt(element.count) : undefined
    };
}
export function mapGroveElementEntry(entry) {
    return {
        key: entry.key,
        element: mapGroveElement(entry.element)
    };
}
export function mapGroveLeafInfo(info) {
    return {
        key: info.key,
        hash: info.hash,
        count: info.count != null ? BigInt(info.count) : undefined
    };
}
export function mapGroveAncestor(ancestor) {
    return {
        levelsUp: ancestor.levelsUp,
        count: BigInt(ancestor.count),
        key: ancestor.key,
        hash: ancestor.hash
    };
}
