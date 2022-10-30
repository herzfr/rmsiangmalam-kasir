export function generateArray(total: number): number[] {
    let ttl = new Array<number>();
    for (let index = 0; index < total; index++) {
        ttl.push(index)
    }
    return ttl;
}
