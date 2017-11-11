export function hashcode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash += (i + 1) * char;
    }
    return hash;
}