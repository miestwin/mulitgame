/**
 * Interfejs pocisków
 * @export
 * @interface IWeapon
 */
export interface IWeapon {
  nextFire: number;
  readonly bulletSpeed: number;
  readonly fireRate: number;
  fire(x: number, y: number): void;
}
