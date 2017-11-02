export function pingPong(initial, alpha, beta, count, func) {
    if (count === 0) {
        return initial;
    }
    if (initial === alpha) {
        alpha = beta;
        beta = initial;
    }
    func(initial, alpha);
    let i = 1;
    if (i === count) {
        return alpha;
    }
    while (true) {
        func(alpha, beta);
        i++;
        if (i === count) {
            return beta;
        }
        func(beta, alpha);
        i++;
        if (i === count) {
            return alpha;
        }
    }
}