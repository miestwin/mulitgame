/**
 * Interfejs pocisków
 * @export
 * @interface IBulelts
 */
export interface IBullets {
    nextFire: number;
    readonly damage: number;
    readonly bulletSpeed: number;
    readonly fireRate: number;
    shoot(sx: number, sy: number): void;
}