import * as rng from 'rng';

export function generateRandomSeed() {
    return (Math.random() * 1000000000000000000).toString(36);
}

export function hashcode(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash += (i + 1) * char;
    }
    return hash;
}

export function rand(seed, offset) {
    return new rng.MT(hashcode(seed) + offset);
}