export namespace rnd {
    export function integerInRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}



// export function rand(seed, offset) {
//     return new rng.MT(hashcode(seed) + offset);
// }

// export function generateRandomSeed() {
//     return (Math.random() * 1000000000000000000).toString(36);
// }

