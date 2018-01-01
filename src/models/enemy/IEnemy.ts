import { IWeapon } from "../bullets";

export interface IEnemy {
  weapon: IWeapon;
  generate(x: number, y: number, sx: number, sy: number): void;
  fire(x: number, y: number): void;
}
