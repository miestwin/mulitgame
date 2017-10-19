export function cross(a, b, o) {
    return (a[0] - o[0])  * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}